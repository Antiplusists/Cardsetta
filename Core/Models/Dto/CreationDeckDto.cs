using System.Collections.Generic;
using Core.Models.Dbo;

namespace Core.Models.Dto
{
    public record CreationDeckDto
    {
        public string Name { get; set; } = null!;
        public List<CardDbo> Cards { get; set; } = new();
    }
}