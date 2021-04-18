using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Models.Dbo;

namespace Core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<DeckDbo> Decks { get; set; } = new();
    }
}