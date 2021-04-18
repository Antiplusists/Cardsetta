using System;
using System.Threading.Tasks;

namespace Core.Repositories.Abstracts
{
    public interface IRepository<TEntity, TCreationEntity, TUpdatingEntity>
    {
        Task<TEntity?> FindAsync(Guid id);
        Task<TEntity> AddAsync(TCreationEntity creationEntity);
        Task<bool> RemoveAsync(Guid id);
        Task<TEntity> UpdateAsync(Guid id, TUpdatingEntity entity);
    }
}