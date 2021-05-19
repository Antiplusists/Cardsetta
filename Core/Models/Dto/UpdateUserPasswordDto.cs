using System.ComponentModel.DataAnnotations;

namespace Core.Models.Dto
{
    public record UpdateUserPasswordDto
    {
        [Required]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }
        
        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
        
        [Required]
        [Compare("NewPassword")]
        [DataType(DataType.Password)]
        public string NewPasswordConfirm { get; set; }
    }
}