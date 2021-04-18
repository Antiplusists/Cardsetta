using System;
using System.Threading.Tasks;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;

namespace Core.Repositories.Realizations
{
    public class DeckRepository: IDeckRepository
    {
        public async Task<DeckDbo?> FindAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<DeckDbo> AddAsync(CreationDeckDto creationEntity)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> RemoveAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<DeckDbo> UpdateAsync(Guid id, CreationDeckDto entity)
        {
            throw new NotImplementedException();
        }
    }
}