using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Response.UserRoleResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IUserRoleRepository: IRepositoryBase<IdentityRole>
    {
        Task<GetUserRolesResponse> GetAllRolesAsync();
        Task<AddUserRoleResponse> AddUserRoleAsync(IdentityRole role);
        Task<GetUserRoleResponse> GetUserRoleByRoleNameAsync(string roleName);
        Task<GetUserRoleResponse> GetUserRoleByRoleIdAsync(string roleId);
        Task<DeleteUserRoleResponse> DeleteUserRoleByIdAsync(string roleId);
        Task<DeleteUserRoleResponse> DeleteUserRoleByNameAsync(string roleName);
        Task<UpdateUserRoleResponse> UpdateUserRoleAsync(IdentityRole role);
        
    }
}
