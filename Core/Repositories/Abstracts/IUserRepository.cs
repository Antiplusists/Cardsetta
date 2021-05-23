using System.Threading.Tasks;
using Core.Models;

namespace Core.Repositories.Abstracts
{
    public interface IUserRepository : IRepository<string, ApplicationUser, ApplicationUser, ApplicationUser>
    {
        Task<ApplicationUser?> FindByNameAsync(string userName);
    }
}