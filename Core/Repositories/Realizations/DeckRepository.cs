using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;

namespace Core.Repositories.Realizations
{
    public class DeckRepository : RepositoryBase<DeckDbo, CreationDeckDto, CreationDeckDto>, IDeckRepository
    {
        public DeckRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<DeckDbo?> FindAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task<DeckDbo> AddAsync(CreationDeckDto creationEntity)
        {
            throw new NotImplementedException();
        }

        public override async Task<bool> RemoveAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public override async Task<DeckDbo> UpdateAsync(Guid id, CreationDeckDto entity)
        {
            throw new NotImplementedException();
        }
    }
}