using System;
using System.Collections.Generic;

namespace Core.Models.Results
{
    public class UserResult
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public List<Guid> DeckIds { get; set; } = new();
    }
}