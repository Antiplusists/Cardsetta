using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace Core.Data
{
    public static class DataExtensions
    {
        public static void PrepareDB(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                try
                {
                    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
                    if (env.IsDevelopment())
                    {
                        scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.Migrate();
                    }
                }
                catch (Exception e)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(e, "An error occurred while migrating or seeding the database.");
                }
            }
        }

        public static void PreparedStatic(this IHost host)
        {
            using var scope = host.Services.CreateScope();
            var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
            var dir = new DirectoryInfo(Path.Combine(env.ContentRootPath, "StaticFiles"));
            if (!dir.Exists)
                dir.Create();
        }
    }
}
