using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Models.Validation;
using Core.Repositories.Abstracts;
using Core.Services.Images;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("api/v1/decks")]
    [Produces("application/json")]
    public class DecksController : Controller
    {
        private readonly IDeckRepository deckRepo;
        private readonly IMapper mapper;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IUserRepository userRepo;

        private async Task<ApplicationUser?> GetCurrentUser()
            => await userManager.GetUserAsync(User);

        public DecksController(IDeckRepository deckRepo, IMapper mapper, UserManager<ApplicationUser> userManager,
            IUserRepository userRepo)
        {
            this.deckRepo = deckRepo;
            this.mapper = mapper;
            this.userManager = userManager;
            this.userRepo = userRepo;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PageListResult<DeckResult>>> GetDecksByTags([TagValidation] [FromQuery] string[] tags,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest("Page number and page size can not be less than 1");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var page = tags.Length > 0
                ? await deckRepo.GetPageByTags(pageNumber, pageSize, tags)
                : await deckRepo.GetPage(pageNumber, pageSize);

            if (!page.Any())
                return NotFound();
            
            var result = new PageListResult<DeckResult>(mapper.Map<List<DeckDbo>, List<DeckResult>>(page),
                page.TotalCount, page.CurrentPage, page.PageSize);

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> CreateDeck([FromForm] CreationDeckDto dto)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var user = (await GetCurrentUser())!;

            var dbo = mapper.Map(dto, new DeckDbo
            {
                Author = user
            });

            dbo.ImagePath = await ImageStore.SaveImage(dto.Image?.OpenReadStream(),
                '.' + dto.Image?.FileName.Split('.')[1]);

            dbo = await deckRepo.AddAsync(dbo);

            return CreatedAtRoute(nameof(GetDeckById), new {deckId = dbo.Id}, mapper.Map<DeckDbo, DeckResult>(dbo));
        }

        [HttpGet("{deckId:guid}", Name = nameof(GetDeckById))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DeckResult>> GetDeckById([FromRoute] Guid deckId)
        {
            var deckDbo = await deckRepo.FindAsync(deckId);

            if (deckDbo is null)
                return NotFound();

            return Ok(mapper.Map<DeckDbo, DeckResult>(deckDbo));
        }

        [HttpPatch("{deckId:guid}")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [Consumes("application/json-patch+json")]
        public async Task<IActionResult> PatchDeck([FromRoute] Guid deckId,
            [FromBody] JsonPatchDocument<UpdateDeckDto>? patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("Patch document is null");

            var deckDbo = await deckRepo.FindAsync(deckId);
            if (deckDbo is null)
                return NotFound();

            var dto = mapper.Map<DeckDbo, UpdateDeckDto>(deckDbo);
            patchDoc.ApplyTo(dto, ModelState);
            TryValidateModel(dto);
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            mapper.Map(dto, deckDbo);
            await deckRepo.UpdateAsync(deckDbo);

            return NoContent();
        }

        [HttpDelete("{deckId:guid}")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteDeck([FromRoute] Guid deckId)
        {
            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            var result = await deckRepo.RemoveAsync(deckId);

            if (result)
                return NoContent();

            throw new AggregateException();
        }

        [HttpPost("{deckId:guid}/update-image")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> UpdateImage([FromRoute] Guid deckId,
            [Models.Validation.FileExtensions("jpg", "jpeg", "png")] IFormFile? image)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();

            if (image is null)
            {
                ImageStore.RemoveImage(deck.ImagePath?.Split('/').Last());
                deck.ImagePath = null;
            }
            else
            {
                var oldPath = deck.ImagePath;
                deck.ImagePath = await ImageStore.SaveImage(image.OpenReadStream(), '.' + image.FileName.Split('.')[1]);
                ImageStore.RemoveImage(oldPath?.Split('/').Last());
            }

            await deckRepo.UpdateAsync(deck);
            return NoContent();
        }

        [HttpPost("{deckId:guid}/update-tags")]
        [Authorize(Policy = "MustBeDeckOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Consumes("application/json")]
        [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
        public async Task<IActionResult> UpdateTags([FromRoute] Guid deckId, [Required] [TagValidation] [FromBody] string[] newTags)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var deck = await deckRepo.FindAsync(deckId);
            if (deck is null)
                return NotFound();
            
            var currentTags = deck.Tags.Select(tagDbo => tagDbo.Tag);
            
            if (currentTags.SequenceEqual(newTags))
                return NoContent();
            var tagsToAddition = newTags.Except(currentTags);
            var tagsToDeletion = currentTags.Except(newTags);

            if (tagsToAddition.Any())
                if (!await deckRepo.AddTags(deckId, tagsToAddition.ToArray()))
                    throw new AggregateException();
            if (tagsToDeletion.Any())
                if (!await deckRepo.RemoveTags(deckId, tagsToDeletion.ToArray()))
                    throw new AggregateException();

            return NoContent();
        }

        [Authorize]
        [HttpGet("my")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<DeckResult>>> GetMyDecks()
        {
            var user = await userRepo.FindByNameAsync(User.GetDisplayName());

            if (!user.Decks.Any())
                return NotFound();

            return Ok(mapper.Map<IEnumerable<DeckDbo>, IEnumerable<DeckResult>>(user.Decks));
        }
    }
}