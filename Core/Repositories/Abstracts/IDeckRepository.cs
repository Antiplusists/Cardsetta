using System;
using System.Threading.Tasks;
using Core.Models.Dbo;
using Core.Models.Entities;

namespace Core.Repositories.Abstracts
{
    public interface IDeckRepository: IRepository<Guid ,DeckDbo, NewDeckEntity, UpdateDeckEntity>
    {
        Task<bool> AddCard(Guid deckId, CardDbo dbo);
        Task<bool> RemoveCard(Guid deckId, Guid cardId);
    }
}