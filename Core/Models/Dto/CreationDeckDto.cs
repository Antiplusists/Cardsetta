using System.Collections.Generic;
using System.Drawing;

namespace Core.Models.Dto
{
    public record CreationDeckDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        //TODO: Хз пока как изображения на шарпе, но пусть пока будет массив байтов раз приходит стрим в запросе
        public byte[,]? Image { get; set; }
        public List<string> Tags { get; set; } = new();
    }
}