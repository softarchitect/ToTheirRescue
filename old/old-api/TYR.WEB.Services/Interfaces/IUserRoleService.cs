using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.UserRoleResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IUserRoleService
    {
        Task<GetUserRolesResponse> GetAllRolesAsync();
        Task<AddUserRoleResponse> AddUserRoleAsync(IdentityRole role);
        Task<GetUserRoleResponse> GetUserRoleByRoleNameAsync(string roleName);
        Task<GetUserRoleResponse> GetUserRoleByRoleIdAsync(string roleId);
        // NOT Required *************************************
        Task<DeleteUserRoleResponse> DeleteUserRoleById(string roleId);
        //Task<DeleteUserRoleResponse> DeleteUserRoleByName(string roleName);
        Task<UpdateUserRoleResponse> UpdateUserRoleAsync(IdentityRole role);
    }
}
