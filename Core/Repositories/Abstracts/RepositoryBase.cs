using System.Threading.Tasks;
using Core.Data;

namespace Core.Repositories.Abstracts
{
    public abstract class RepositoryBase<TId, TEntity, TCreationEntity, TUpdatingEntity>: IRepository<TId, TEntity, TCreationEntity, TUpdatingEntity>
    {
        protected readonly ApplicationDbContext DbContext;

        protected RepositoryBase(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }
        
        public abstract Task<TEntity?> FindAsync(TId id);
        public abstract Task<TEntity> AddAsync(TCreationEntity creationEntity);
        public abstract Task<bool> RemoveAsync(TId id);
        public abstract Task<TEntity> UpdateAsync(TId id, TUpdatingEntity entity);
    }
}