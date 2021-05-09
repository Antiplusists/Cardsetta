﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Core.Models;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Models.Results;
using Core.Repositories.Abstracts;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class DecksController : Controller
    {
        private readonly IDeckRepository deckRepo;
        private readonly IMapper mapper;
        private readonly UserManager<ApplicationUser> userManager;

        public DecksController(IDeckRepository deckRepo, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            this.deckRepo = deckRepo;
            this.mapper = mapper;
            this.userManager = userManager;
        }
        
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PageList<DeckResult>>> GetDecksByTags([FromQuery] string[] tags,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest("Page number and page size can not be less than 1");
            if (!tags.All(tag => !string.IsNullOrEmpty(tag) && tag.All(char.IsLetterOrDigit)))
                return BadRequest("Tags should contains only letters and digits");
            if (!tags.All(tag => tag.All(char.IsLower)))
                return BadRequest("Tags should be in lower case");
            if (!tags.All(tag => tag.Length <= 30))
                return BadRequest("Tags should not be bigger than 30 symbols");
            
            var page = tags.Length > 0 
                ? await deckRepo.GetPageByTags(pageNumber, pageSize, tags) 
                : await deckRepo.GetPage(pageNumber, pageSize);
            
            var result = new PageListResult<DeckResult>(mapper.Map<List<DeckDbo>, List<DeckResult>>(page), page.TotalCount,
                page.CurrentPage, page.PageSize);
            
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

            var user = await userManager.FindByIdAsync(User.GetSubjectId());

            if (user is null)
                return Unauthorized();

            var dbo = mapper.Map(dto, new DeckDbo
            {
                Author = user
            });

            dbo = await deckRepo.AddAsync(dbo);

            return CreatedAtRoute(nameof(GetDeckById), new {deckId = dbo.Id}, dbo.Id);
        }

        [HttpGet]
        [Route("{deckId:guid}")]
        public async Task<ActionResult<DeckResult>> GetDeckById([FromRoute] Guid deckId)
        {
            throw new NotImplementedException();
        }
    }
}