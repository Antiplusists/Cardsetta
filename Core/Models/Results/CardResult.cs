using System;

namespace Core.Models.Results
{
    public class CardResult
    {
        public Guid Id { get; set; }
        public string? Question { get; set; }
        public string Answer { get; set; } = null!;
        public string? ImagePath { get; set; }
    }
}