using System;
using System.ComponentModel.DataAnnotations;
using Core.Models.Entities;

namespace Core.Models.Dbo
{
    public class CardDbo
    {
        public CardDbo()
        {
        }
        
        public CardDbo(CreationCardEntity cardEntity)
        {
            Id = Guid.NewGuid();
            Type = cardEntity.Type;
            Question = cardEntity.Question;
            Answer = cardEntity.Answer;
            ImagePath = cardEntity.ImagePath;
        }
        
        [Key] 
        public Guid Id { get; set; }
        public CardType Type { get; set; }
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
        public string? ImagePath { get; set; }
    }
}