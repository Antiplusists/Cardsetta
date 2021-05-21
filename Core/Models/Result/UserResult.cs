using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Models.Result
{
    public class UserResult
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public List<Guid> DeckIds { get; set; } = new();
        [DataType(DataType.ImageUrl)]
        public string? ImagePath { get; set; }
    }
}