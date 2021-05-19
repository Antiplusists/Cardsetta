using System;
using System.Collections.Generic;

namespace Core.Models.Results
{
    public class DeckResult
    {
        public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public HashSet<string> Tags { get; set; } = new();
    }
}