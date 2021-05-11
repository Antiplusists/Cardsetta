using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Models;
using Core.Models.Dbo;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Core.Repositories.Abstracts
{
    public interface IDeckRepository: IRepository<Guid, DeckDbo, DeckDbo, DeckDbo>
    {
        Task<CardDbo?> AddCard(Guid deckId, CardDbo dbo);
        Task<CardDbo?> RemoveCard(Guid deckId, Guid cardId);
        Task<bool> AddTags(Guid deckId, params string[] tags);
        Task<bool> RemoveTags(Guid deckId, params string[] tags);
        Task<PageList<DeckDbo>> GetPageByTags(int pageNumber, int pageSize, params string[] tags);
        Task<PageList<DeckDbo>> GetPage(int pageNumber, int pageSize);
        Task<PageList<DeckDbo>> GetPageByAuthorId(int pageNumber, int pageSize, Guid authorId);
        Task<DeckDbo> UpdateAsync(DeckDbo dbo);
    }
}