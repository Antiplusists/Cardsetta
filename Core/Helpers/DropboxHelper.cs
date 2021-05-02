using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dropbox.Api;
using Dropbox.Api.Files;
using Microsoft.AspNetCore.Http;

namespace Core.Helpers
{
    public static class DropboxHelper
    {
        public const string ImageDirectory = "Images/";
        
        public static IEnumerable<string> AllowedImageMimes
        {
            get
            {
                yield return "image/gif";
                yield return "image/jpeg";
                yield return "image/pjpeg";
                yield return "image/png";
            }
        }

        private static readonly DropboxClient dropboxClient;

        static DropboxHelper()
        {
            dropboxClient = new DropboxClient(Environment.GetEnvironmentVariable("DROPBOX_TOKEN"));
        }
        
        public static async Task<string?> UploadImage(IFormFile? file)
        {
            if (file is null) return null;
            
            if (!AllowedImageMimes.Contains(file.ContentType))
                throw new ArgumentException(file.ContentType + "is not supported.");

            var fileExt = file.FileName[file.FileName.LastIndexOf('.')..];
            var filePath = ImageDirectory + DateTime.Now.Ticks + fileExt;

            try
            {
                await dropboxClient.Files.UploadAsync(filePath, WriteMode.Overwrite.Instance, body: file.OpenReadStream());
            }
            catch (ApiException<UploadError> e)
            {
                return null;
            }
            
            
            return filePath;
        }
    }
}