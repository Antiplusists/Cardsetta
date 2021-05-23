using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Core.Models.Validation
{
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Parameter | AttributeTargets.Property)]
    public class TagValidationAttribute : ValidationAttribute
    {
        [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
                return ValidationResult.Success;

            if (value is not IEnumerable<string> tags)
                return new ValidationResult("Value is not collection of strings");
            
            if (!tags.All(tag => !string.IsNullOrEmpty(tag) && tag.All(char.IsLetterOrDigit)))
                return new ValidationResult("Tags should contains only letters and digits");
            if (!tags.All(tag => tag.All( c => char.IsLower(c) || char.IsDigit(c))))
                return new ValidationResult("Tags should be in lower case");
            if (!tags.All(tag => tag.Length <= 30))
                return new ValidationResult("Tags should not be bigger than 30 symbols");
            
            return ValidationResult.Success;
        }
    }
}