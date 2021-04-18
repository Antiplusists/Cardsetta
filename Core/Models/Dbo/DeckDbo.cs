using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Core.Models.Dto;

namespace Core.Models.Dbo
{
    public class DeckDbo
    {
        public DeckDbo()
        {
        }

        public DeckDbo(CreationDeckDto dto)
        {
            Id = Guid.NewGuid();
            Name = dto.Name;
            Cards = dto.Cards;
        }

        [Key] public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public List<CardDbo> Cards { get; set; } = new();
    }
}