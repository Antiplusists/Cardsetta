using System;
using Core.Models.Dbo;
using Core.Models.Entities;

namespace Core.Repositories.Abstracts
{
    public interface ICardRepository: IRepository<Guid, CardDbo, CreationCardEntity, CreationCardEntity>
    {
        
    }
}