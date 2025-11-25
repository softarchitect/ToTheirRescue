using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IRefreshTokenRepository: IRepositoryBase<RefreshToken>
    {
        Task<RefreshToken> GetRefreshTokenByTokenAsync(string refreshToken);
        Task<bool> UpdateRefreshTokenByUsed(string refreshToken, bool isUsed);
    }
}
