using System.ComponentModel.DataAnnotations;
using Core.Models.Validation;

namespace Core.Models.Dto
{
    public record CreationUserDto
    {
        [Required]
        [OnlyLettersAndNumbers]
        public string UserName { get; set; } = null!;
        
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
        
        [Required]
        [Compare("Password", ErrorMessage = "Passwords not equals")]
        [DataType(DataType.Password)]
        public string PasswordConfirm { get; set; } = null!;
    }
}