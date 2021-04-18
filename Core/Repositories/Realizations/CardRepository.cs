using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Repositories.Realizations
{
    public class CardRepository : RepositoryBase<CardDbo, CreationCardDto, CreationCardDto>, ICardRepository
    {
        public CardRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<CardDbo?> FindAsync(Guid id)
        {
            return await DbContext.Cards.FindAsync(id);
        }

        public override async Task<CardDbo> AddAsync(CreationCardDto creationEntity)
        {
            var newCard = new CardDbo(creationEntity);
            var result = await DbContext.Cards.AddAsync(newCard);

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

        public override async Task<CardDbo> UpdateAsync(Guid id, CreationCardDto entity)
        {
            var model = new CardDbo(entity) {Id = id};
            var result = DbContext.Cards.Update(model);

            await DbContext.SaveChangesAsync();

            if (result is {State: EntityState.Modified})
                return result.Entity!;

            throw new OperationException("Failed to update entity");
        }
    }
}