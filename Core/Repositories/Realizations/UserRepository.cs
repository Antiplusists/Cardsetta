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
            var user = await DbContext.Users
                .Include(applicationUser => applicationUser.Decks)
                .ThenInclude(deck => deck.Tags)
                .FirstOrDefaultAsync(applicationUser => applicationUser.Id == id);
            return user ?? null;
        }
        
        public async Task<ApplicationUser?> FindByNameAsync(string userName)
        {
            var user = await DbContext.Users
                    .Include(applicationUser => applicationUser.Decks)
                    .ThenInclude(deck => deck.Tags)
                    .FirstOrDefaultAsync(u => u.NormalizedUserName == userName.ToUpperInvariant());
            return user ?? null;
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