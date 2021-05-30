using System.ComponentModel.DataAnnotations;
using Core.Models.Validation;

namespace Core.Models.Dto
{
    public record AuthUserDto
    {
        [Required] [OnlyLettersAndNumbers] public string UserName { get; set; } = null!;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }
}