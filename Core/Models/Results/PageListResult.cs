using System;
using System.Collections.Generic;

namespace Core.Models.Results
{
    public class PageListResult<TResult>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public long TotalCount { get; set; }
        public bool HasPrevious => CurrentPage > 1;
        public bool HasNext => CurrentPage < TotalPages;
        public List<TResult> Items { get; set; }

        public PageListResult(IEnumerable<TResult> items, long totalCount, int currentPage, int pageSize)
        {
            TotalCount = totalCount;
            PageSize = pageSize;
            CurrentPage = currentPage;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            Items = new List<TResult>(items);
        }
    }
}