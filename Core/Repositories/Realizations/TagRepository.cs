using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Repositories.Realizations
{
    public class TagRepository : RepositoryBase<string, TagDbo, string, string?>, ITagRepository
    {
        public TagRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<TagDbo?> FindAsync(string tag)
        {
            return await DbContext.Tags.FindAsync(tag);
        }

        public override async Task<TagDbo> AddAsync(string tag)
        {
            var result = await DbContext.Tags.AddAsync(new TagDbo(tag));

            await DbContext.SaveChangesAsync();

            return result.Entity!;
        }

        public override async Task<bool> RemoveAsync(string tag)
        {
            var result = DbContext.Tags.Remove(new TagDbo(tag));

            await DbContext.SaveChangesAsync();

            return result.State is EntityState.Deleted;
        }

        public override async Task<TagDbo> UpdateAsync(string tag, string? _)
        {
            var result = DbContext.Tags.Update(new TagDbo(tag));

            await DbContext.SaveChangesAsync();

            if (result.State is EntityState.Modified) return result.Entity!;

            throw new OperationException("Failed to update entity");
        }
    }
}