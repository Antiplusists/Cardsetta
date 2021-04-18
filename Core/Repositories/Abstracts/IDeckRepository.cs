using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.Repositories.Abstracts
{
    public interface IDeckRepository: IRepository<DeckDbo, CreationDeckDto, CreationDeckDto>
    {
    }
}