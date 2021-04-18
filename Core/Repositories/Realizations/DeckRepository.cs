using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Repositories.Realizations
{
    public class DeckRepository : RepositoryBase<DeckDbo, CreationDeckDto, CreationDeckDto>, IDeckRepository
    {
        public DeckRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<DeckDbo?> FindAsync(Guid id)
        {
            return await DbContext.Decks.FindAsync(id);
        }

        public override async Task<DeckDbo> AddAsync(CreationDeckDto creationEntity)
        {
            var newDeck = new DeckDbo(creationEntity);
            var result = await DbContext.Decks.AddAsync(newDeck);

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

        public override async Task<DeckDbo> UpdateAsync(Guid id, CreationDeckDto entity)
        {
            var model = new DeckDbo(entity) {Id = id};
            var result = DbContext.Decks.Update(model);

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Modified})
                return result.Entity!;

            throw new OperationException("Failed to update entity");
        }
    }
}