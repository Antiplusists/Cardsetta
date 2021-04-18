using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.Repositories.Abstracts
{
    public interface ICardRepository: IRepository<CardDbo, CreationCardDto, CreationCardDto>
    {
        
    }
}