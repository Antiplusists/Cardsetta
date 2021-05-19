﻿using System;
using System.Threading.Tasks;
using Core.Repositories.Abstracts;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Core.Services.Authorization
{
    public class MustBeDeckOwnerHandler : AuthorizationHandler<MustBeDeckOwnerRequirement>
    {
        private readonly IDeckRepository deckRepository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public MustBeDeckOwnerHandler(IDeckRepository deckRepository, IHttpContextAccessor httpContextAccessor)
        {
            this.deckRepository = deckRepository;
            this.httpContextAccessor = httpContextAccessor;
        }
        
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, MustBeDeckOwnerRequirement requirement)
        {
            var userId = context.User.GetSubjectId();
            var httpContext = httpContextAccessor.HttpContext;
            var deckIdString = httpContext?.GetRouteValue("deckId")?.ToString();
            
            if (!Guid.TryParse(deckIdString, out var deckId))
            {
                context.Fail();
                return;
            }

            var deck = await deckRepository.FindAsync(deckId);

            if (deck is not null && deck.Author.Id == userId)
            {
                context.Succeed(requirement);
                return;
            }
            
            context.Fail();
        }
    }
}