using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Dbo
{
    public class TagDbo
    {
        public TagDbo(string tag)
            => Tag = tag;

        [Key] public string Tag { get; set; } = null!;

        public List<DeckDbo> Decks { get; set; } = new();
    }
}