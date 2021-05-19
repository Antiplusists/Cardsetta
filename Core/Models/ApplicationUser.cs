using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using Core.Models.Dbo;

namespace Core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? ImagePath { get; set; }
        public List<DeckDbo> Decks { get; set; } = new();
    }
}