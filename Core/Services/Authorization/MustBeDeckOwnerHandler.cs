using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Repositories.Abstracts;
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
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                context.Fail();
                return;
            }
            var httpContext = httpContextAccessor.HttpContext;
            var deckIdString = httpContext?.GetRouteValue("deckId")?.ToString();
            
            if (!Guid.TryParse(deckIdString, out var deckId))
            {
                context.Fail();
                return;
            }

            var deck = await deckRepository.FindAsync(deckId);

            if (deck is null)
            {
                context.Succeed(requirement);
                return;
            }

            if (deck.Author.Id == userId)
            {
                context.Succeed(requirement);
                return;
            }
            
            context.Fail();
        }
    }
}