using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Models.Dbo;

namespace Core.Repositories.Abstracts
{
    public interface IDeckRepository: IRepository<Guid, DeckDbo, DeckDbo, DeckDbo>
    {
        Task<CardDbo?> AddCard(Guid deckId, CardDbo dbo);
        Task<CardDbo?> RemoveCard(Guid deckId, Guid cardId);
        Task<bool> AddTags(Guid deckId, params string[] tags);
        Task<bool> RemoveTags(Guid deckId, params string[] tags);
        IEnumerable<DeckDbo> FindByTags(params string[] tags);
    }
}