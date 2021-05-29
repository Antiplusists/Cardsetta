using System;
using System.IO;
using System.Threading.Tasks;

namespace Core.Services.Images
{
    public static class ImageStore
    {
        private const string ImageFolder = "StaticFiles/images";
        private const string OutputPath = "files/images";

        static ImageStore()
        {
            if (!Directory.Exists(ImageFolder))
                Directory.CreateDirectory(ImageFolder);
        }
        
        public static async Task<string?> SaveImage(Stream? imageStream, string fileExtension)
        {
            if (imageStream is null) return null;
            
            var name = DateTime.Now.Ticks + fileExtension;
            
            await using var fileWriter = File.Open($"{ImageFolder}/{name}", FileMode.CreateNew, FileAccess.Write);
            await imageStream.CopyToAsync(fileWriter);
            
            return $"{OutputPath}/{name}";
        }
    }
}