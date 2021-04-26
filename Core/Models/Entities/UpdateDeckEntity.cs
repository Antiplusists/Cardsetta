using System;
using System.Collections.Generic;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.Models.Entities
{
    public record UpdateDeckEntity
    {
        public UpdateDeckEntity(Guid authorId, string imagePath, UpdateDeckDto dto)
        {
            AuthorId = authorId;
            Name = dto.Name;
            Description = dto.Description;
            Cards = dto.Cards;
            ImagePath = imagePath;
        }
        
        public Guid AuthorId;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<CardDbo> Cards { get; set; } = new();
        public string? ImagePath { get; set; }
    }
}