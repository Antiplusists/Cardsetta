using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Dbo
{
    public class CardDbo
    {
        [Key] 
        public Guid Id { get; set; }
        public CardType Type { get; set; }
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
        public string? ImagePath { get; set; }
    }
}