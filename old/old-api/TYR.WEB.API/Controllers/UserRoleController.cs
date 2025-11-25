using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.Response.UserRoleResult;
using TYR.WEB.Models.ViewModels.AcquisitionWayViewModel;
using TYR.WEB.Models.ViewModels.AnimalTypeViewModel;
using TYR.WEB.Models.ViewModels.BehaviorViewModel;
using TYR.WEB.Models.ViewModels.UserRoleViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/user-role")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserRoleService _userRoleService;

        public UserRoleController(RoleManager<IdentityRole> roleManager,IHttpContextAccessor httpContextAccessor, IMapper mapper, IUserRoleService userRoleService)
        {
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _mapper = mapper;
            _userRoleService = userRoleService;
        }

        [HttpPost]
        [Route("create-user-role")]
        public async Task<IActionResult> AddUserRoles([FromBody] UserRoleVm userRoleVm)
        {
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<IdentityRole>(userRoleVm);

                if(await _roleManager.RoleExistsAsync(model.Name))
                {
                    var _AddUserRoleResponseExists = new AddUserRoleResponse
                    {
                        Data = new AddUserRoleData
                        {
                            Name = model.Name,
                            Result = false,
                            Success = "Role Name already exists.",
                            Id = model.Id
                        }
                    };
                    return BadRequest(_AddUserRoleResponseExists);
                }
                else
                {
                    var result = await _userRoleService.AddUserRoleAsync(model);
                    
                    return Ok(result);
                }
            }
            return BadRequest(new AddUserRoleResponse
            {
                Success = false,
                Errors = new List<string>() {
                        "Invalid user role request."
                    }
            });
        }

        [HttpGet]
        [Route("get-user-roles")]
        public async Task<IActionResult> GetAllActiveUserRoles()
        {
           return Ok(await _userRoleService.GetAllRolesAsync());
        }
        [HttpGet]
        [Route("get-user-role-by-id")]
        public async Task<IActionResult> GetUserRoleByRoleId(string roleId)
        {
            if (string.IsNullOrEmpty(roleId))
            {
                return BadRequest(new GetUserRoleResponse
                {
                    Success = false,
                    Errors = new List<string>()
                    {
                        "Role Id is required."
                    },
                    StatusCode = 400
                });
            }

            return Ok(await _userRoleService.GetUserRoleByRoleIdAsync(roleId));
        }

        [HttpGet]
        [Route("get-user-role-by-name")]
        public async Task<IActionResult> GetUserRoleByRoleName(string roleName)
        {
            if(string.IsNullOrEmpty(roleName))
            {
                return BadRequest(new GetUserRoleResponse
                {
                    Success = false,
                    Errors = new List<string>()
                    {
                        "Role Name is required."
                    },
                    StatusCode = 400
                });
            }

            return Ok(await _userRoleService.GetUserRoleByRoleNameAsync(roleName));
        }

        [HttpPost]
        [Route("update-user-role/{id}")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] UserRoleVm userRoleVm)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new UpdateUserRoleResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Role Id is required" }
                });
            }
            if (ModelState.IsValid)
            {
                var model = _mapper.Map<IdentityRole>(userRoleVm);
                var vRole = await _roleManager.FindByIdAsync(id);
                if (vRole == null)
                {
                    return Ok(new UpdateUserRoleResponse()
                    {
                        Success = false,
                        Data = new UpdateUserRoleData { Id = id },
                        Errors = new List<string> { "No record found" },
                        StatusCode = 400
                    });
                }

                vRole.Name = model.Name;

                var result = await _userRoleService.UpdateUserRoleAsync(vRole);
                if (result.Success) return Ok(result);
            }

            return BadRequest(new UpdateBehaviorResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid behavior request." }
            });
        }

        [HttpDelete]
        [Route("delete-user-role/{id}")]
        public async Task<IActionResult> DeleteUserRole(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new DeleteBehaviorResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Role Id is required." }
                });
            }

            var result = await _userRoleService.DeleteUserRoleById(id);
            if (result.Success) return Ok(result);

            return BadRequest(result);

        }
    }
}
