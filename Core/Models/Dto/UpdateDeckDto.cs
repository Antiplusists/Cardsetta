using System;
using System.Collections.Generic;
using Core.Models.Dbo;

namespace Core.Models.Dto
{
    public record UpdateDeckDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        //TODO: Хз откуд в дто карточки возьмутся, но пока оставлю
        public List<CardDbo> Cards { get; set; } = new();
    }
}