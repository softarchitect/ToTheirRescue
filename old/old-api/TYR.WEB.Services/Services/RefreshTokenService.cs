using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        public RefreshTokenService(IRefreshTokenRepository refreshTokenRepository)
        {
            _refreshTokenRepository = refreshTokenRepository;
        }
        public async Task<RefreshToken> AddAsync(RefreshToken entity) => await _refreshTokenRepository.AddAsync(entity);
        
        public async Task<RefreshToken> GetRefreshTokenByTokenAsync(string refreshToken) => await _refreshTokenRepository.GetRefreshTokenByTokenAsync(refreshToken);
        
        public async Task<bool> UpdateRefreshTokenByUsed(string refreshToken, bool isUsed) => await _refreshTokenRepository.UpdateRefreshTokenByUsed(refreshToken, isUsed);
        
    }
}
