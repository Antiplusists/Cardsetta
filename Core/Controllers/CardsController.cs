using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route( "api/v1/decks/{deckId:guid}/cards")]
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
            cardDbo = await deckRepo.AddCard(deckId, cardDbo);

            if (cardDbo is null)
                throw new AggregateException();

            return CreatedAtRoute(nameof(GetCardById), new {deckId, cardId = cardDbo.Id}, cardDbo.Id);
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
        public async Task<IActionResult> PatchCard([FromRoute] Guid deckId, [FromRoute] Guid cardId,
            [FromForm] JsonPatchDocument<UpdateCardDto>? patchDoc)
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

        [HttpPost("{cardId:guid}/update-image")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> UpdateImage([FromRoute] Guid deckId, [FromRoute] Guid cardId,
            [Required] [Models.Validation.FileExtensions("jpg", "jpeg", "png")] IFormFile image)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            var card = deck.Cards.Find(cardDbo => cardDbo.Id == cardId);
            if (card is null)
                return NotFound();
            
            //TODO: Тут какое-то обновление картинки

            await cardRepo.UpdateAsync(card);
            return NoContent();
        }
    }
}