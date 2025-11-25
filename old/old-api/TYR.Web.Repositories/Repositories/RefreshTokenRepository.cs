using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;

namespace TYR.Web.Repositories.Repositories
{
    public class RefreshTokenRepository : RepositoryBase<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(TYRDbContext dbContext) : base(dbContext) { }
        //private readonly TYRDbContext dbContext;
        //public RefreshTokenRepository(TYRDbContext _dbContext)
        //{
        //    dbContext = _dbContext;
        //}

        //public async Task<RefreshToken> AddAsync(RefreshToken entity)
        //{
        //    await dbContext.RefreshTokens.AddAsync(entity);
        //    await dbContext.SaveChangesAsync();
        //    return entity;
        //}

        //public Task<bool> DeleteAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<IList<RefreshToken>> FindAllAsync(Expression<Func<RefreshToken, bool>> predicate)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<RefreshToken> FindAsync(Expression<Func<RefreshToken, bool>> predicate)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<List<RefreshToken>> GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<RefreshToken> GetByIdAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //public async Task<RefreshToken> GetRefreshTokenByTokenAsync(string refreshToken)
        //{
        //    if (string.IsNullOrEmpty(refreshToken))
        //        return await Task.FromResult<RefreshToken>(null);

        //    var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token.Equals(refreshToken));
        //    if (token == null) return await Task.FromResult<RefreshToken>(null);

        //    return token;
        //}

        //public async Task<RefreshToken> UpdateAsync(RefreshToken entity, object key)
        //{
        //    if (entity == null)
        //        return await Task.FromResult<RefreshToken>(null);

        //    var refreshToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Id.Equals(entity.Id));
        //    // Update
        //    refreshToken.UserId = entity?.UserId;
        //    refreshToken.Token = entity?.Token;
        //    refreshToken.JwtId = entity?.JwtId;
        //    refreshToken.IsUsed = entity.IsUsed;
        //    refreshToken.IsRevoked = entity.IsRevoked;


        //    dbContext.RefreshTokens.Update(entity);
        //    await dbContext.SaveChangesAsync();
        //    return entity;
        //}

        //public async Task<bool> UpdateRefreshTokenByUsed(string refreshToken, bool isUsed)
        //{
        //    if (string.IsNullOrEmpty(refreshToken))
        //        return false;

        //    var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token.Equals(refreshToken));
        //    if (token == null) return false;

        //    token.IsUsed = isUsed;
        //    dbContext.RefreshTokens.Update(token);
        //    await dbContext.SaveChangesAsync();
        //    return true;
        //}

        //public Task<RefreshToken> UpsertAsync(RefreshToken entity)
        //{
        //    throw new NotImplementedException();
        //}
        public async Task<RefreshToken> GetRefreshTokenByTokenAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return await Task.FromResult<RefreshToken>(null);

            //var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token.Equals(refreshToken));
            var token = await FindAsync(r => r.Token.Equals(refreshToken));
            if (token == null) return await Task.FromResult<RefreshToken>(null);

            return token;
        }

        public async Task<bool> UpdateRefreshTokenByUsed(string refreshToken, bool isUsed)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return false;

            //var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token.Equals(refreshToken));
            //if (token == null) return false;

            //token.IsUsed = isUsed;
            //dbContext.RefreshTokens.Update(token);
            //await dbContext.SaveChangesAsync();
            //return true;


            var vRefreshToken = await FindAsync(r => r.Token.Equals(refreshToken));
            if (vRefreshToken == null) return false;

            vRefreshToken.IsUsed = isUsed;
            await base.UpdateAsync(vRefreshToken);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
