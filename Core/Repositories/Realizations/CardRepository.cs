using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

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

            await DbContext.SaveChangesAsync();

            return result.Entity!;
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            var result = DbContext.Cards.Remove(new CardDbo {Id = id});

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Deleted})
                return true;

            return false;
        }

        public override async Task<CardDbo> UpdateAsync(Guid id, CardDbo dbo)
        {
            dbo.Id = id;
            var result = DbContext.Cards.Update(dbo);

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Modified})
                return result.Entity!;

            throw new OperationException("Failed to update entity");
        }

        public async Task<CardDbo> UpdateAsync(CardDbo dbo)
        {
            return await UpdateAsync(dbo.Id, dbo);
        }
    }
}