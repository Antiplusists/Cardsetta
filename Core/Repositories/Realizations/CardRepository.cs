using System;
using System.Threading.Tasks;
using Core.Models.Dbo;
using Core.Models.Dto;
using Core.Repositories.Abstracts;

namespace Core.Repositories.Realizations
{
    public class CardRepository: ICardRepository
    {
        public async Task<CardDbo?> FindAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<CardDbo> AddAsync(CreationCardDto creationEntity)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> RemoveAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<CardDbo> UpdateAsync(Guid id, CreationCardDto entity)
        {
            throw new NotImplementedException();
        }
    }
}