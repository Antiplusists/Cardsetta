using System;
using Core.Models.Dbo;

namespace Core.Repositories.Abstracts
{
    public interface ICardRepository: IRepository<Guid, CardDbo, CardDbo, CardDbo>
    {
        
    }
}