using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;

namespace Core.Repositories.Realizations
{
    public class CardRepository : RepositoryBase<CardDbo, CreationCardDto, CreationCardDto>, ICardRepository
    {
        public CardRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<CardDbo?> FindAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task<CardDbo> AddAsync(CreationCardDto creationEntity)
        {
            throw new NotImplementedException();
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task<CardDbo> UpdateAsync(Guid id, CreationCardDto entity)
        {
            throw new NotImplementedException();
        }
    }
}