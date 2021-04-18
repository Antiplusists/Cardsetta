using System;
using System.ComponentModel.DataAnnotations;
using Core.Models.Dto;

namespace Core.Models.Dbo
{
    public class CardDbo
    {
        public CardDbo()
        {
        }
        
        public CardDbo(CreationCardDto cardDto)
        {
            Id = Guid.NewGuid();
            Type = cardDto.Type;
            Question = cardDto.Question;
            Answer = cardDto.Answer;
        }
        
        [Key] 
        public Guid Id { get; set; }
        public CardType Type { get; set; }
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
    }
}