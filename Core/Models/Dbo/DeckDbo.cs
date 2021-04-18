using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Dbo
{
    public class DeckDbo
    {
        [Key] 
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public List<CardDbo> Cards { get; set; } = new();
    }
}