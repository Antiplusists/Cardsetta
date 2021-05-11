using Core.Models.Dbo;

namespace Core.Repositories.Abstracts
{
    public interface ITagRepository : IRepository<string, TagDbo, string, string?> { }
}