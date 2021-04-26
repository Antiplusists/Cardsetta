using System;
using System.Collections.Generic;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.Models.Entities
{
    public record NewDeckEntity
    {
        public NewDeckEntity(Guid authorId, string? imagePath, List<TagDbo> tags, CreationDeckDto dto)
        {
            AuthorId = authorId;
            Name = dto.Name;
            Description = dto.Description;
            ImagePath = imagePath;
            Tags = tags;
        }
        
        public Guid AuthorId;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public List<TagDbo> Tags { get; set; } = new();
    }
}