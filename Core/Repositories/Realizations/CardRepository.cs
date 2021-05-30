using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories.Realizations
{
    public class CardRepository : RepositoryBase<Guid ,CardDbo, CardDbo, CardDbo>, ICardRepository
    {
        public CardRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<CardDbo?> FindAsync(Guid id)
        {
            return await DbContext.Cards.FindAsync(id);
        }

        public override async Task<CardDbo> AddAsync(CardDbo dbo)
        {
            var result = await DbContext.Cards.AddAsync(dbo);

            if (result is not {State: EntityState.Added})
                throw new AggregateException();

            await DbContext.SaveChangesAsync();

            return result.Entity!;
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            var card = await DbContext.Cards.FindAsync(id);
            var result = DbContext.Cards.Remove(card);

            if (result is not {State: EntityState.Deleted})
                throw new AggregateException();
            
            await DbContext.SaveChangesAsync();

            return result is {State: EntityState.Detached};
        }

        public override async Task<CardDbo> UpdateAsync(Guid id, CardDbo dbo)
        {
            dbo.Id = id;
            var result = DbContext.Cards.Update(dbo);

            if (result is not {State: EntityState.Modified})
                throw new AggregateException();
            
            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Unchanged})
                return result.Entity!;

            throw new DbUpdateException("Failed to update entity");
        }

        public async Task<CardDbo> UpdateAsync(CardDbo dbo)
        {
            return await UpdateAsync(dbo.Id, dbo);
        }
    }
}