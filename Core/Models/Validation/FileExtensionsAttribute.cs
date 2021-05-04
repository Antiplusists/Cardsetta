using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Validation
{
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property | AttributeTargets.Parameter, AllowMultiple = false)]
    public class FileExtensionsAttribute : ValidationAttribute
    {
        public string[] Extensions { get; }
        
        public FileExtensionsAttribute(params string[] extensions)
        {
            Extensions = extensions;
        }
        
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null) return ValidationResult.Success;

            if (value is not IFormFile file) return new ValidationResult("Value is not a file");

            var extension = Path.GetExtension(file.FileName);
            extension = string.IsNullOrEmpty(extension) ? extension : extension[1..];
            
            return Extensions.Contains(extension)
                ? ValidationResult.Success
                : new ValidationResult("Not allowed extension");
        }
    }
}