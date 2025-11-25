using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess;

namespace TYR.Web.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected TYRDbContext _context;
        public RepositoryBase(TYRDbContext context)
        {
            _context = context;
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Set<T>().FindAsync(id);
            if (entity == null) return false;
            
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<T> FindAsync(Expression<Func<T, bool>> predicate) => await _context.Set<T>().SingleOrDefaultAsync(predicate);

        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> predicate) => await _context.Set<T>().Where(predicate).ToListAsync();
        
        public async Task<List<T>> GetAllAsync() => await _context.Set<T>().ToListAsync();
        
        public async Task<T> GetByIdAsync(int id) => await _context.Set<T>().FindAsync(id);

        public Task<T> UpsertAsync(T entity) => throw new NotImplementedException();

        //public virtual async Task<T> UpdateAsync(T entity, object key)
        public virtual async Task<T> UpdateAsync(T entity)
        {

            _context.Entry(entity).State = EntityState.Modified;
            //if (entity == null)
            //    return null;
            //T exist = await _context.Set<T>().FindAsync(key);
            //if (exist != null)
            //{
            //    _context.Entry(exist).CurrentValues.SetValues(entity);
            //    await _context.SaveChangesAsync();
            //}
            //return exist;
            //await _context.SaveChangesAsync();
            return entity;
        }
    }
}
