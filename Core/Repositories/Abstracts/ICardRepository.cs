using System;
using Core.Models.Dbo;
using Core.Models.Dto;

namespace Core.Repositories.Abstracts
{
    public interface ICardRepository: IRepository<Guid, CardDbo, CreationCardDto, CreationCardDto>
    {
        
    }
}