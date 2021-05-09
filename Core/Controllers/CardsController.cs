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
    }
}