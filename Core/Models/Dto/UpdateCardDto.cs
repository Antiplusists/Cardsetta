using System.ComponentModel.DataAnnotations;
using Core.Models.Validation;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Dto
{
    public record UpdateCardDto
    {
        [Required]
        public CardType Type { get; set; }
        [OnlyLettersAndNumbers]
        [StringLength(500)]
        public string? Question { get; set; }
        [Required]
        [OnlyLettersAndNumbers]
        [StringLength(500)]
        public string Answer { get; set; } = null!;
    }
}