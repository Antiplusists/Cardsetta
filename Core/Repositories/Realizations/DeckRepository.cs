using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Entities;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Repositories.Realizations
{
    public class DeckRepository : RepositoryBase<Guid, DeckDbo, NewDeckEntity, UpdateDeckEntity>, IDeckRepository
    {
        public DeckRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<DeckDbo?> FindAsync(Guid id)
        {
            return await DbContext.Decks.FindAsync(id);
        }

        public override async Task<DeckDbo> AddAsync(NewDeckEntity creationEntity)
        {
            var newDeck = new DeckDbo(creationEntity);
            var result = await DbContext.Decks.AddAsync(newDeck);

            foreach (var tag in creationEntity.Tags)
            {
                var tagDbo = await DbContext.Tags.FindAsync(tag);
                result.Entity!.Tags.Add(tagDbo ?? new TagDbo(tag));
            }

            await DbContext.SaveChangesAsync();

            return result.Entity!;
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            var result = DbContext.Decks.Remove(new DeckDbo {Id = id});

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Deleted})
                return true;

            return false;
        }

        public override async Task<DeckDbo> UpdateAsync(Guid id, UpdateDeckEntity entity)
        {
            var model = new DeckDbo(entity) {Id = id};
            var result = DbContext.Decks.Update(model);

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Modified})
                return result.Entity!;

            throw new OperationException("Failed to update entity");
        }
        
        
        public async Task<bool> AddCard(Guid deckId, CardDbo dbo)
        {
            var deck = await FindAsync(deckId);
            if (deck is null) return false;
            
            deck.Cards.Add(dbo);
            
            return await DbContext.SaveChangesAsync() != 0;
        }

        public async Task<bool> RemoveCard(Guid deckId, Guid cardId)
        {
            var deck = await FindAsync(deckId);
            var card = deck?.Cards.Find(card => card.Id == cardId);
            if (card is null) return false;
            
            deck!.Cards.Remove(card);

            return await DbContext.SaveChangesAsync() != 0;
        }
    }
}