using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Core.Models.Dto;
using Core.Models.Entities;

namespace Core.Models.Dbo
{
    public class DeckDbo
    {
        public DeckDbo()
        {
        }
        
        public DeckDbo(NewDeckEntity entity)
        {
            Id = Guid.NewGuid();
            AuthorId = entity.AuthorId;
            Name = entity.Name;
            Description = entity.Description;
            ImagePath = entity.ImagePath;
        }

        public DeckDbo(UpdateDeckEntity entity)
        {
            AuthorId = entity.AuthorId;
            Name = entity.Name;
            Description = entity.Description;
            Cards = entity.Cards;
            ImagePath = entity.ImagePath;
        }

        [Key] public Guid Id { get; set; }
        public Guid AuthorId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public List<CardDbo> Cards { get; set; } = new();
        public string? ImagePath { get; set; }
    }
}