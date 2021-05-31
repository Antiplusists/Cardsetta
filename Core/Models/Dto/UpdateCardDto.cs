using System.ComponentModel.DataAnnotations;
using Core.Models.Validation;

namespace Core.Models.Dto
{
    public record UpdateCardDto
    {
        [OnlyLettersAndNumbers]
        [StringLength(500)]
        public string? Question { get; set; }
        [Required]
        [OnlyLettersAndNumbers]
        [StringLength(500)]
        public string Answer { get; set; } = null!;
    }
}