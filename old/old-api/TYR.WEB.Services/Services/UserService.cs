using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Models.ViewModels.UserViewModel;
using TYR.Web.Repositories.Interfaces;
namespace TYR.WEB.Services.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserRepository _userRepository;
        public UserService(UserManager<ApplicationUser> userManager, IUserRepository userRepository)
        {
            _userManager = userManager;
            _userRepository = userRepository;
        }

        public async Task<int> GetTenantIdByUserName(string username)
        {
            var vUser = await _userManager.FindByNameAsync(username);
            return vUser.TenantId;
        }

        public async Task<ApplicationUser> GetUserByUserName(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<List<ApplicationUser>> GetUsersByTenantId(int tenantId, bool status)
        {
            if (status)
                return await _userManager.Users?.Where(u => u.TenantId == tenantId && u.IsDeleted.Equals(false)).ToListAsync();
            else
                return await _userManager.Users?.Where(u => u.TenantId == tenantId && u.IsDeleted.Equals(true)).ToListAsync();
        }

        public async Task<ApplicationUser> GetUserByEmail(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IdentityResult> AddTokenExpiration(ApplicationUser user, string tokenType) => await _userRepository.AddTokenExpiration(user, tokenType);
        public async Task<bool> ValidateTokenExpires(ApplicationUser user) => await _userRepository.ValidateTokenExpires(user);
        public async Task<bool> RemoveTokenExpiry(ApplicationUser user) => await _userRepository.RemoveTokenExpiry(user);
    }
}
