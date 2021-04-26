using System;
using System.Threading.Tasks;

namespace Core.Repositories.Abstracts
{
    public interface IRepository<TId ,TEntity, TCreationEntity, TUpdatingEntity>
    {
        Task<TEntity?> FindAsync(TId id);
        Task<TEntity> AddAsync(TCreationEntity creationEntity);
        Task<bool> RemoveAsync(TId id);
        Task<TEntity> UpdateAsync(TId id, TUpdatingEntity entity);
    }
}