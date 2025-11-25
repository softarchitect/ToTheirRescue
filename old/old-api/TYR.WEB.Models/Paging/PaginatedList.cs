using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Models.Paging
{
    public class PaginatedList<T> : List<T>
    {

        public int TotalPages { get; set; }
        public int CurrentPage { get; private set; }
        public int TotalCount { get; set; }
        public PaginatedList() { }
        public PaginatedList(List<T> items, int count , int pageIndex, int pageSize)
        {
             
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            CurrentPage = (pageIndex < 0) ? 1 : pageIndex;
            TotalCount = count;
            this.AddRange(items);
        }
         

        public bool PreviousPage
        {
            get { return (CurrentPage > 1); }
        }
        public bool NextPage
        {
            get { return (CurrentPage < TotalPages); }
        }

       

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PaginatedList<T>(items, count, pageIndex, pageSize); 
        }

    }
}
