using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;

namespace TYR.WEB.Services.Interfaces
{
    public interface IUserService
    {
        Task<ApplicationUser> GetUserByUserName(string username);
        Task<int> GetTenantIdByUserName(string username);
        Task<List<ApplicationUser>> GetUsersByTenantId(int tenantId, bool status);
        Task<ApplicationUser> GetUserByEmail(string email);
        Task<IdentityResult> AddTokenExpiration(ApplicationUser user, string TokenType);
        Task<bool> ValidateTokenExpires(ApplicationUser user);
        Task<bool> RemoveTokenExpiry(ApplicationUser user);
    }
}
