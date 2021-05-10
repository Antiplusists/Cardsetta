using System;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Result
{
    public class UserResult
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        [DataType(DataType.ImageUrl)]
        public string? ImagePath { get; set; }
    }
}