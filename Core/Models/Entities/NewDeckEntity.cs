using System;
using Core.Models.Dto;

namespace Core.Models.Entities
{
    public record NewDeckEntity
    {
        public NewDeckEntity(Guid authorId, string? imagePath, CreationDeckDto dto)
        {
            AuthorId = authorId;
            Name = dto.Name;
            Description = dto.Description;
            ImagePath = imagePath;
        }
        
        public Guid AuthorId;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
    }
}