using System;
using System.Threading.Tasks;
using Core.Data;
using Core.Models.Dbo;
using Core.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories.Realizations
{
    public class TagRepository : RepositoryBase<string, TagDbo, string, string?>, ITagRepository
    {
        public TagRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<TagDbo?> FindAsync(string tag)
        {
            var tagDbo = await DbContext.Tags.FindAsync(tag);
            if (tagDbo is null) return null;
            
            var entry = DbContext.Entry(tagDbo);
            await entry.Collection(t => t.Decks).LoadAsync();
            return tagDbo;
        }

        public override async Task<TagDbo> AddAsync(string tag)
        {
            var result = await DbContext.Tags.AddAsync(new TagDbo(tag));

            if (result is not {State: EntityState.Added})
                throw new AggregateException();

            await DbContext.SaveChangesAsync();

            return result.Entity!;
        }

        public override Task<bool> RemoveAsync(string tag)
        {
            throw new NotSupportedException();
        }

        public override Task<TagDbo> UpdateAsync(string tag, string? _)
        {
            throw new NotSupportedException();
        }
    }
}