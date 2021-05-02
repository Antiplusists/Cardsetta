using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Dto
{
    public record CreationDeckDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public List<string> Tags { get; set; } = new();
    }
}