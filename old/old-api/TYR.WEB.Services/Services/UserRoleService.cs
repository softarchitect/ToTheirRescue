using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.Web.Repositories.Repositories;
using TYR.WEB.Models.Response.UserRoleResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoleRepository;

        public UserRoleService(IUserRoleRepository userRoleRepository) => _userRoleRepository = userRoleRepository;
        public async Task<AddUserRoleResponse> AddUserRoleAsync(IdentityRole role) =>
                 await _userRoleRepository.AddUserRoleAsync(role);

        public async Task<DeleteUserRoleResponse> DeleteUserRoleById(string roleId) =>
            await _userRoleRepository.DeleteUserRoleByIdAsync(roleId);

        public async Task<GetUserRolesResponse> GetAllRolesAsync() =>
            await _userRoleRepository.GetAllRolesAsync();


        public async Task<GetUserRoleResponse> GetUserRoleByRoleIdAsync(string roleId) =>
            await _userRoleRepository.GetUserRoleByRoleIdAsync(roleId);

        public async Task<GetUserRoleResponse> GetUserRoleByRoleNameAsync(string roleName) =>
            await _userRoleRepository.GetUserRoleByRoleNameAsync(roleName);

        public async Task<UpdateUserRoleResponse> UpdateUserRoleAsync(IdentityRole role) =>
            await _userRoleRepository.UpdateUserRoleAsync(role);    
    }
}
