using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Models.Dbo
{
    public class CardDbo
    {
        [Key] 
        public Guid Id { get; set; }
        public string? Question { get; set; }
        public string Answer { get; set; } = null!;
        public string? ImagePath { get; set; } 
        [Column(TypeName = "jsonb")]
        public Dictionary<Guid, int> Marks { get; set; } = new();
        public DateTimeOffset TimeToRepeat { get; set; }
    }
}