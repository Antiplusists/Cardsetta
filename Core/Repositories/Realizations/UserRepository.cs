using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories.Realizations
{
    public class UserRepository : RepositoryBase<string, ApplicationUser, ApplicationUser, ApplicationUser>, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<ApplicationUser?> FindAsync(string id)
        {
            var user = await DbContext.Users.FindAsync(id);
            if (user is null) return null;
            var entry = DbContext.Entry(user);
            await entry.Collection(u => u.Decks).LoadAsync();
            return user;
        }
        
        public async Task<ApplicationUser?> FindByNameAsync(string userName)
        {
            var user = await DbContext.Users.FirstOrDefaultAsync(u =>
                u.NormalizedUserName == userName.ToUpperInvariant());
            if (user is null) return null;
            
            var entry = DbContext.Entry(user);
            await entry.Collection(u => u.Decks).LoadAsync();
            return user;
        }

        public override Task<ApplicationUser> AddAsync(ApplicationUser creationEntity)
        {
            throw new NotSupportedException("Use UserManager");
        }

        public override Task<bool> RemoveAsync(string id)
        {
            throw new NotSupportedException("Use UserManager");
        }

        public override Task<ApplicationUser> UpdateAsync(string id, ApplicationUser entity)
        {
            throw new NotSupportedException("Use UserManager");
        }
    }
}