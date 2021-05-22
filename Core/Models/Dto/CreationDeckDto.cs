using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Core.Models.Validation;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Dto
{
    public record CreationDeckDto
    {
        [Required]
        [OnlyLettersAndNumbers]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Validation.FileExtensions("jpg", "jpeg", "png")]
        public IFormFile? Image { get; set; }
        [TagValidation]
        public HashSet<string> Tags { get; set; } = new();
    }
}