using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> userManager;

        private async Task<ApplicationUser?> GetCurrentUser()
            => await userManager.GetUserAsync(User);
        
        public CardsController(IDeckRepository deckRepo, ICardRepository cardRepo, IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            this.deckRepo = deckRepo;
            this.cardRepo = cardRepo;
            this.mapper = mapper;
            this.userManager = userManager;
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
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> AddCard([FromRoute] Guid deckId, [FromForm] CreationCardDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);
            
            var deck = await deckRepo.FindAsync(deckId);
            
            if (deck is null)
                return NotFound();

            if (!deck.Author.Equals(await GetCurrentUser()))
                return Unauthorized();

            var cardDbo = mapper.Map<CreationCardDto, CardDbo>(dto);
            cardDbo = await deckRepo.AddCard(deckId, cardDbo);

            if (cardDbo is null)
                throw new AggregateException();

            return CreatedAtRoute(nameof(GetCardById), new {deckId, cardId = cardDbo.Id}, cardDbo.Id);
        }

        [HttpGet("{cardId:guid}")]
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
    }
}