using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Core.Helpers;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Repositories.Abstracts;
using Core.Services.Images;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("api/v1/decks/{deckId:guid}/cards")]
    [Produces("application/json")]
    public class CardsController : Controller
    {
        private readonly IDeckRepository deckRepo;
        private readonly ICardRepository cardRepo;
        private readonly IMapper mapper;

        public CardsController(IDeckRepository deckRepo, ICardRepository cardRepo, IMapper mapper)
        {
            this.deckRepo = deckRepo;
            this.cardRepo = cardRepo;
            this.mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CardResult>>> GetCards([FromRoute] Guid deckId)
        {
            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            return Ok(mapper.Map<IEnumerable<CardDbo>, IEnumerable<CardResult>>(deck.Cards));
        }

        [HttpPost]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> AddCard([FromRoute] Guid deckId, [FromForm] CreationCardDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var deck = await deckRepo.FindAsync(deckId);

            if (deck is null)
                return NotFound();

            var cardDbo = mapper.Map<CreationCardDto, CardDbo>(dto);
            cardDbo.ImagePath = await ImageStore.SaveImage(dto.Image?.OpenReadStream(),
                '.' + dto.Image?.FileName.Split('.')[1]);
            cardDbo = await deckRepo.AddCard(deckId, cardDbo);

            if (cardDbo is null)
                throw new AggregateException();

            return CreatedAtRoute(nameof(GetCardById), new {deckId, cardId = cardDbo.Id},
                mapper.Map<CardDbo, CardResult>(cardDbo));
        }

        [HttpGet("{cardId:guid}", Name = nameof(GetCardById))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CardResult>> GetCardById([FromRoute] Guid deckId, [FromRoute] Guid cardId)
        {
            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            var card = deck.Cards.Find(cardDbo => cardDbo.Id == cardId);
            if (card is null)
                return NotFound();

            return Ok(mapper.Map<CardDbo, CardResult>(card));
        }

        [HttpDelete("{cardId:guid}")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveCard([FromRoute] Guid deckId, [FromRoute] Guid cardId)
        {
            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            var card = await deckRepo.RemoveCard(deckId, cardId);
            if (card is null)
                return NotFound();

            if (!await cardRepo.RemoveAsync(cardId))
                throw new AggregateException();

            return NoContent();
        }

        [HttpPatch("{cardId:guid}")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [Consumes("application/json-patch+json")]
        public async Task<IActionResult> PatchCard([FromRoute] Guid deckId, [FromRoute] Guid cardId,
            [FromBody] JsonPatchDocument<UpdateCardDto>? patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("Patch document is null");

            var deckDbo = await deckRepo.FindAsync(deckId);
            if (deckDbo is null)
                return NotFound();

            var cardDbo = deckDbo.Cards.Find(card => card.Id == cardId);
            if (cardDbo is null)
                return NotFound();

            var dto = mapper.Map<CardDbo, UpdateCardDto>(cardDbo);
            patchDoc.ApplyTo(dto, ModelState);
            TryValidateModel(dto);
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            mapper.Map(dto, cardDbo);
            await cardRepo.UpdateAsync(cardDbo);

            return NoContent();
        }

        [HttpPost("{cardId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [Consumes("application/json")]
        public async Task<IActionResult> AcceptCard([FromRoute] Guid deckId, [FromRoute] Guid cardId,
            [FromBody] bool isRight)
        {
            if (Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
                return NotFound();

            var deckDbo = await deckRepo.FindAsync(deckId);
            if (deckDbo is null)
                return NotFound();

            var cardDbo = deckDbo.Cards.Find(card => card.Id == cardId);
            if (cardDbo is null)
                return NotFound();

            if (!cardDbo.Marks.TryGetValue(userId, out var mark))
            {
                mark = 0;
                cardDbo.Marks.Add(userId, mark);
            }

            mark = isRight ? ++mark : --mark;

            var time = mark switch
            {
                < 0 => 1.Minutes(),
                > 3 => 1.Days(),
                0 => 5.Minutes(),
                1 => 30.Minutes(),
                2 => 1.Hours(),
                3 => 12.Hours()
            };

            cardDbo.TimeToRepeat = DateTimeOffset.UtcNow + time;
            cardDbo.Marks[userId] = mark;

            await cardRepo.UpdateAsync(cardDbo);

            return NoContent();
        }

        [HttpPost("{cardId:guid}/update-image")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> UpdateImage([FromRoute] Guid deckId, [FromRoute] Guid cardId,
            [Models.Validation.FileExtensions("jpg", "jpeg", "png")]
            IFormFile? image)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            var card = deck.Cards.Find(cardDbo => cardDbo.Id == cardId);
            if (card is null)
                return NotFound();

            if (image is null)
            {
                ImageStore.RemoveImage(card.ImagePath?.Split('/').Last());
                card.ImagePath = null;
            }
            else
            {
                var oldPath = card.ImagePath;
                card.ImagePath = await ImageStore.SaveImage(image.OpenReadStream(), '.' + image.FileName.Split('.')[1]);
                ImageStore.RemoveImage(oldPath?.Split('/').Last());
            }

            await cardRepo.UpdateAsync(card);
            return NoContent();
        }
    }
}