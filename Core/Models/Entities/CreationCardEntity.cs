using Core.Models.Dto;

namespace Core.Models.Entities
{
    public record CreationCardEntity
    {
        public CreationCardEntity(string? imagePath, CreationCardDto dto)
        {
            Type = dto.Type;
            Question = dto.Question;
            Answer = dto.Answer;
            ImagePath = imagePath;
        }
        
        public CardType Type { get; set; }
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
        public string? ImagePath { get; set; }
    }
}