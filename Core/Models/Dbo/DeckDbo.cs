using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Dbo
{
    public class DeckDbo
    {
        [Key] public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<CardDbo> Cards { get; set; } = new();
        public string? ImagePath { get; set; }
        public HashSet<TagDbo> Tags { get; set; } = new();
    }
}