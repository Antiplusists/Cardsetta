using System;
using System.Threading.Tasks;
using Core.Data;

namespace Core.Repositories.Abstracts
{
    public abstract class RepositoryBase<TEntity, TCreationEntity, TUpdatingEntity>: IRepository<TEntity, TCreationEntity, TUpdatingEntity>
    {
        protected readonly ApplicationDbContext DbContext;

        protected RepositoryBase(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }
        
        public abstract Task<TEntity?> FindAsync(Guid id);
        public abstract Task<TEntity> AddAsync(TCreationEntity creationEntity);
        public abstract Task<bool> RemoveAsync(Guid id);
        public abstract Task<TEntity> UpdateAsync(Guid id, TUpdatingEntity entity);
    }
}