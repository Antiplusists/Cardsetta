using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Core.Models.Validation
{
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property | AttributeTargets.Parameter, AllowMultiple = false)]
    public class OnlyLettersAndNumbersAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null) return ValidationResult.Success;
            
            if (value is not string text) return new ValidationResult("Value is not a string");

            return text.Any(@char => !char.IsLetter(@char) && !char.IsDigit(@char) && !char.IsWhiteSpace(@char))
                ? new ValidationResult("Contains non-letter or non-number symbol")
                : ValidationResult.Success;
        }
    }
}