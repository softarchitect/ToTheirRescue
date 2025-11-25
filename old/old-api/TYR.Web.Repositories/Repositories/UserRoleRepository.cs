using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.Web.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using TYR.WEB.Models.Response.UserRoleResult;
using AutoMapper;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.DataAccess;
using TYR.WEB.Models.Response.AnimalResult;
using Microsoft.EntityFrameworkCore;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class UserRoleRepository : RepositoryBase<IdentityRole>, IUserRoleRepository
    {
        private readonly TYRDbContext _dbContext;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRoleRepository(TYRDbContext context, RoleManager<IdentityRole> roleManager) : base(context)
        {
            _dbContext = context;
            _roleManager = roleManager;
        }

        public async Task<AddUserRoleResponse> AddUserRoleAsync(IdentityRole role)
        {
            try
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(role.Name));
                if(result.Succeeded)
                {
                    var roleDetails = await _roleManager.FindByNameAsync(role.Name);
                    return new AddUserRoleResponse
                    {
                        Data = new AddUserRoleData
                        {
                            Name = roleDetails.Name,
                            Id = roleDetails.Id
                        },
                        Success = true,
                        StatusCode = 200,
                        Message = "Role created"
                    };
                }

                return new AddUserRoleResponse
                {
                    Data = new AddUserRoleData
                    {
                        Name = role.Name,
                        Result = result.Succeeded,
                        Success = result.ToString(),
                        Id = role.Id
                    },
                    Success = false,
                    StatusCode = 400,
                    Message = "Role not created"
                };


            }
            catch (Exception ex)
            {
                return new AddUserRoleResponse
                {
                    Errors = new List<string> { "Oops! something went wrong in adding new role", ex.Message, ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false
                };
            }
        }

        public async Task<DeleteUserRoleResponse> DeleteUserRoleByIdAsync(string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                if(role == null)
                {
                    return new DeleteUserRoleResponse
                    {
                        Errors = new List<string> { "Record not found." },
                        StatusCode = 200,
                        Success = false
                    };
                }

                var result = await _roleManager.DeleteAsync(role);
                return new DeleteUserRoleResponse
                {
                    Data = new DeleteUserRoleData
                    {
                        IsDeleted = result.Succeeded
                    },
                    Success = true,
                    StatusCode = 200,
                    Message = "Role deleted"
                };
            }
            catch (Exception ex)
            {
                return new DeleteUserRoleResponse
                {
                    Errors = new List<string> { "Oops! something went wrong in deleting role", ex.Message, ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public Task<DeleteUserRoleResponse> DeleteUserRoleByNameAsync(string roleName)
        {
            throw new NotImplementedException();
        }

        public async Task<GetUserRolesResponse> GetAllRolesAsync()
        {
            try
            {
                var roles = await _roleManager.Roles.ToListAsync();
                return new GetUserRolesResponse {
                    Data = new GetUserRolesData { 
                        Roles = roles, 
                    },
                    Message = "Roles retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetUserRolesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting roles", ex.Message, ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetUserRoleResponse> GetUserRoleByRoleNameAsync(string roleName)
        {
            try
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                return new GetUserRoleResponse
                {
                    Data = new GetUserRoleData
                    {
                        Id = role.Id,
                        Name = role.Name
                    },
                    Message = "User role retrieved successfully.",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetUserRoleResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetUserRoleResponse> GetUserRoleByRoleIdAsync(string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                return new GetUserRoleResponse
                {
                    Data = new GetUserRoleData
                    {
                        Id = role.Id,
                        Name = role.Name
                    },
                    Message = "User role retrieved successfully.",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetUserRoleResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateUserRoleResponse> UpdateUserRoleAsync(IdentityRole role)
        {
            try
            {
                var result = await _roleManager.UpdateAsync(role);
                return new UpdateUserRoleResponse()
                {
                    Success = result.Succeeded.Equals(true) ? true : false,
                    Data = new UpdateUserRoleData { Id = role.Id, IdentityRole = role },
                    Message = result.Succeeded.Equals(true) ? "User Role has updated successfully" : "User Role has not updated successfully",
                    StatusCode = result.Succeeded.Equals(true) ? 200 : 400
                };
            }
            catch (Exception ex)
            {
                return new UpdateUserRoleResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
