using System;
using System.Threading.Tasks;
using Core.Models.Dbo;

namespace Core.Repositories.Abstracts
{
    public interface ICardRepository: IRepository<Guid, CardDbo, CardDbo, CardDbo>
    {
        Task<CardDbo> UpdateAsync(CardDbo dbo);
    }
}