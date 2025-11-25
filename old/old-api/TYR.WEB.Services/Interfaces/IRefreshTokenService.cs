using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> AddAsync(RefreshToken entity);
        Task<RefreshToken> GetRefreshTokenByTokenAsync(string refreshToken);
        Task<bool> UpdateRefreshTokenByUsed(string refreshToken, bool isUsed);
    }
}
