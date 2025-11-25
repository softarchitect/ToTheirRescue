using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using TYR.WEB.API.Responses;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.UserResult;
using TYR.WEB.Models.ViewModels.UserRoleViewModel;
using TYR.WEB.Models.ViewModels.UserViewModel;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.Controllers
{
    [Authorize]
    [Route("api/user/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        //private const string V = "emailConfirmationTokenExpiredAt";
        protected readonly UserManager<ApplicationUser> _userManager;
        private readonly string _currentUsername;
        private readonly IUserService _userService;
        private readonly ITenantService _tenantService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IUserRoleService _userRoleService;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserController(UserManager<ApplicationUser> userManager,
                IConfiguration configuration, RoleManager<IdentityRole> roleManager,
                IWebHostEnvironment env,
                IRefreshTokenService refreshTokenService,
                TokenValidationParameters tokenValidationParams,
                IHttpContextAccessor httpContextAccessor,
                IUserService userService,
                ITenantService tenantService, IMapper mapper,
                IEmailService emailService, IUserRoleService userRoleService)
        {
            _userManager = userManager;
            _currentUsername = httpContextAccessor.HttpContext.User.Identity.Name;
            _userService = userService;
            _tenantService = tenantService;
            _mapper = mapper;
            _emailService = emailService;
            _roleManager = roleManager;
            _userRoleService = userRoleService;
        }

        [HttpPut]
        [Route("update-user/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserVm updateUserVm)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User identifier required" }
                });
            }

            if(ModelState.IsValid)
            {
                var model = _mapper.Map<ApplicationUser>(updateUserVm);
                // Check User already exist or not?
                var userExists = await _userManager.FindByIdAsync(id);
                if (userExists == null)
                {
                    return BadRequest(new UpdateUserResponse { 
                        Success = false,
                        Errors = new List<string>() { "User does not exist!" }
                    });
                }
                    
                //Check for Email exists
                var emailExists = await _userManager.FindByEmailAsync(model.Email);
                if (emailExists != null && emailExists.Id != userExists.Id)
                {
                    return BadRequest(new UpdateUserResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Email already exist!" }
                    });
                }
                 
                userExists.FirstName = model.FirstName;
                userExists.LastName = model.LastName;
                userExists.Email = model.Email;
                var result = await _userManager.UpdateAsync(userExists);
                if (!result.Succeeded)
                {
                    return BadRequest(new UpdateUserResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "User update failed! Please check user details and try again." }
                    });
                }
                // ASH- Need to work regarding roles - For now Putting Administrator. It should be updated based on role later
                //string role = updateUserVm.Role.ToLower().Equals(UserRoles.Administrator.ToLower()) ? UserRoles.Administrator: UserRoles.Regular;
                //string role = updateUserVm.Role.ToLower().Equals(UserRoles.Administrator.ToLower()) ? UserRoles.Administrator : UserRoles.Administrator;
                
                var roles = _roleManager.Roles.ToList();
                string role = string.Empty;
                foreach (var item in roles)
                {
                    if (updateUserVm.Role.ToLower().Equals(item.Name.ToLower()))
                    {
                        role = item.Name;
                        break;
                    }
                }

                var userRole = await _userManager.GetRolesAsync(userExists);
                await _userManager.RemoveFromRoleAsync(userExists, userRole[0]);
                await _userManager.AddToRoleAsync(userExists, role);

                var usersVM = _mapper.Map<UsersVM>(userExists);
                var response = new UpdateUserResponse
                {
                    Success = true,
                    Data = new UpdateUserData { UsersVM = usersVM },
                    Message = "User updated successfully!",
                    StatusCode = 200,
                    Errors = null
                };
                return Ok(response);
            }

            return BadRequest(new UpdateUserResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid update user request" }
            });

        }

        [HttpGet]
        [AllowAnonymous]
        [Route("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token, string email)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Token required" }
                });
            }

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Email required" }
                });
            }
            var user = await _userManager.FindByEmailAsync(email);
            var istokenExpired = await _userService.ValidateTokenExpires(user);
            if (!istokenExpired)
            {
                var response = new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Invitation has expired." }

                };
                return Ok(response);
            }
            //string tokenStr = Encoding.UTF8.GetString(Convert.FromBase64String(token));
          
           
            if (user == null)
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "No user found." }
                });
            }
            if (user.EmailConfirmed)
            {
                var response = new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "you are already verified!" }
                     
                };
                return Ok(response);
            }
            else
            {

                user = await _userManager.FindByEmailAsync(email);
                var usersVM = _mapper.Map<UsersVM>(user);
                var response = new UpdateUserResponse
                {
                    Success = true,
                    Data = new UpdateUserData { UsersVM = usersVM },
                    
                    StatusCode = 200
                };
                return Ok(response);
               // Message = "User verified successfully!",

            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("signup-verify-email")]
        public async Task<IActionResult> AdminVerifyEmail(string token, string email)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Token required" }
                });
            }

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Email required" }
                });
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "No user found." }
                });
            }
            if (user.EmailConfirmed)
            {
                var response = new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "you are already verified!" }

                };
                return Ok(response);
            }
            else
            {
                string tokenStr = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var istokenExpired = await _userService.ValidateTokenExpires(user);
                if (!istokenExpired)
                {
                    var response = new UpdateUserResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Invitation has expired." }

                    };
                    return Ok(response);
                }
                var result = await _userManager.ConfirmEmailAsync(user, tokenStr);
                if (result.Succeeded)
                {
                    user.Status = "Active";
                    user.DateActive = DateTime.Now;
                    user.DateEntered = DateTime.Now;
                    var isUpdated = await _userManager.UpdateAsync(user);
                    if (isUpdated.Succeeded)
                    {
                        user = await _userManager.FindByEmailAsync(email);
                        await _userService.RemoveTokenExpiry(user);
                        var usersVM = _mapper.Map<UsersVM>(user);
                        var response = new UpdateUserResponse
                        {
                            Success = true,
                            Data = new UpdateUserData { UsersVM = usersVM },
                            Message = "User verified successfully!",
                            StatusCode = 200
                        };
                        return Ok(response);
                    }
                    else
                    {
                        return BadRequest(new UpdateUserResponse
                        {
                            Success = false,
                            Errors = new List<string>() {
                        "Invitation has expired."
                    }
                        });
                    }
                }
                else
                {
                    return BadRequest(new UpdateUserResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Invitation has expired." }
                    });
                }


            }
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("update-user-on-emailconfirmation")]
        public async Task<IActionResult> UpdateUserNamePassword([FromBody] UserNamePasswordUpdateVM updateUserVm, string token)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByIdAsync(updateUserVm.Id);
              
                if (user != null)
                {

                    string tokenStr = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                    var istokenExpired = await _userService.ValidateTokenExpires(user);
                    if (!istokenExpired)
                    {
                        var response = new UpdateUserResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "Invitation has expired." }

                        };
                        return Ok(response);
                    }
                    var EmailConfimationResult = await _userManager.ConfirmEmailAsync(user, tokenStr);
                    if (EmailConfimationResult.Succeeded)
                    {
                       
                        user.SecurityStamp = Guid.NewGuid().ToString();
                        user.PasswordHash = Guid.NewGuid().ToString();
                        var passwordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                        await _userManager.ResetPasswordAsync(user, passwordToken, updateUserVm.Password);
                        user.UserName = updateUserVm.UserName;
                        user.FirstName = updateUserVm.FirstName;
                        user.LastName = updateUserVm.LastName;
                        user.Status = "Active";
                        user.DateActive = DateTime.Now;
                        user.DateEntered = DateTime.Now;
                        user.AlternateEmailAddress = updateUserVm.AlternateEmailAddress;
                        user.PhoneNumber = updateUserVm.PhoneNumber;
                        var result = await _userManager.UpdateAsync(user);
                        var usersVM = _mapper.Map<UsersVM>(user);
                        
                        if (result.Succeeded)
                        {
                            await _userService.RemoveTokenExpiry(user);
                            var response = new UpdateUserResponse
                            {
                                Success = true,
                                Data = new UpdateUserData { UsersVM = usersVM },
                                Message = "User updated successfully!",
                                StatusCode = 200,
                                Errors = new List<string> { }
                            };
                            return Ok(response);
                        }
                        else
                        {
                            return BadRequest(new UpdateUserResponse
                            {
                                Success = false,
                                Errors = new List<string>() { "User update failed! Please try again." }
                            });
                        }
                    }
                    else
                    {
                        return Ok(new UpdateUserResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "Invitation has expired." }
                        });
                    }
                }
                return BadRequest(new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User not found." }
                });
            }

            return BadRequest(new UpdateUserResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Username and Password request." }
            });

        }

        [Route("get-users/{status}")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsersByTenantId(bool status)
        {
            var users = await _userService.GetUsersByTenantId(await _userService.GetTenantIdByUserName(_currentUsername), status);
            if (users.Count >= 1)
            {
                var _uservm = _mapper.Map<List<UsersVM>>(users);

                var tenant = await _tenantService.GetTenantbyIdAsync(await _userService.GetTenantIdByUserName(_currentUsername));
                if (tenant != null)
                {
                    var tenantModel = _mapper.Map<UserTenantVM>(tenant);
                    foreach (var items in _uservm)
                    {
                        var user = await _userManager.FindByIdAsync(items.Id);
                        var userRole = await _userManager.GetRolesAsync(user);
                        items.Role = userRole.Count >= 1 ? Convert.ToString(userRole[0]) : "";
                        items.Tenant = tenantModel;
                    }
                }
                var response = new GetUserListResponse
                {
                    Success = true,
                    Data = new GetUserListData { UsersVMs = _uservm },
                    Message = "User fetched successfully!",
                    StatusCode = 200
                };
                return Ok(response);
            }

            return Ok(new GetUserListResponse
            {
                Success = true,
                Message = "No record found!"
            });
        }

        [HttpGet]
        [Authorize]
        [Route("get-user-by-Id/{Id}")]
        public async Task<IActionResult> GetUserByName(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return BadRequest(new GetUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "No record found" }
                });
            }

            var users = await _userManager.FindByIdAsync(Id);
            if (users != null)
            {
                var userModel = _mapper.Map<UsersVM>(users);
                int tenantId = await _userService.GetTenantIdByUserName(_currentUsername);
                var tenant = await _tenantService.GetTenantbyIdAsync(tenantId);
                if (tenant != null)
                {
                    var tenantModel = _mapper.Map<UserTenantVM>(tenant);
                    userModel.Tenant = tenantModel;
                }
                var userRole = await _userManager.GetRolesAsync(users);
                userModel.Role = userRole.Count >= 1 ? Convert.ToString(userRole[0]) : "";
                var response = new GetUserResponse
                {
                    Success = true,
                    Data = new GetUserData { UsersVM = userModel },
                    Message = "User fetched successfully!",
                    StatusCode = 200
                };
                return Ok(response);
            }

            return Ok(new GetUserResponse
            {
                Success = true,
                Message = "No record found!"
            });
        }

        [HttpPost]
        [Authorize]
        [Route("inviteuser")]
        public async Task<IActionResult> InviteUser([FromBody] InviteUserVm inviteUserVm)
        {
            if (ModelState.IsValid)
            {
                // Double check for security the Super Administrator role
                var vUser = await _userService.GetUserByUserName(_currentUsername);
                var lstRoles = await _userManager.GetRolesAsync(vUser);
                string currentUserRoleName = lstRoles.Count >= 1 ? Convert.ToString(lstRoles[0]) : "";
                if (string.IsNullOrEmpty(currentUserRoleName) && !currentUserRoleName.Equals(UserRoles.SuperAdministrator) && !currentUserRoleName.Equals(UserRoles.Administrator))
                {
                    return BadRequest(new UserInviteResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "User has not invited by Super!" }
                    });
                }
                /****************/

                var model = _mapper.Map<ApplicationUser>(inviteUserVm);
                var verifyEmail = await _userManager.FindByEmailAsync(model.Email);
                if (verifyEmail != null)
                {
                    return BadRequest(new UserInviteResponse
                    {
                        Success = false,
                        Errors = new List<string>() { "Email already taken!" }
                    });
                }
                int tenantId = await _userManager.GetTenanatId(_currentUsername);
                ApplicationUser user = new ApplicationUser()
                {
                    UserName = Convert.ToString(Guid.NewGuid()),
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    TenantId = tenantId,
                    PhoneNumber = model.PhoneNumber,
                    Inviter = _currentUsername,
                    EnteredBy = _currentUsername,
                    DateInvited = DateTime.Now,
                    DateEntered = DateTime.Now,
                };
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    // Ash - Need to work based on Role selected - for now updating Administrator to fix the error
                    //string role = inviteUserVm.RoleName.ToLower() == UserRoles.Administrator.ToLower() ? UserRoles.Administrator : UserRoles.Regular;

                    var roles = _roleManager.Roles.ToList();
                    string role = string.Empty;
                    foreach (var item in roles)
                    {
                        if(inviteUserVm.RoleName.ToLower().Equals(item.Name.ToLower()))
                        {
                            role = item.Name;
                            break;
                        }
                    }

                    //string role = inviteUserVm.RoleName.ToLower() == UserRoles.Administrator.ToLower() ? UserRoles.Administrator : UserRoles.Administrator;
                    await _userManager.AddToRoleAsync(user, role);
                    verifyEmail = await _userManager.FindByEmailAsync(inviteUserVm.Email);
                    var currentUser = await _userManager.FindByNameAsync(_currentUsername);
                    //var token = HttpUtility.UrlEncode(await _userManager.GenerateEmailConfirmationTokenAsync(verifyEmail));
                    string strToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(strToken));
                    //Remove existing Token Expiry
                    await  _userService.RemoveTokenExpiry(user);
                    //Add Email Exipration for token 
                    await  _userService.AddTokenExpiration(user, EmailTokenType.InvitationToken);
                  
                    var emailsend = await _emailService.InvitationEmail(currentUser.FirstName +" "+ currentUser.LastName, user.FirstName + " "+ user.LastName, user.Email, token);
                    if (emailsend.IsSuccessStatusCode)
                    {
                        var response = new UserInviteResponse
                        {
                            StatusCode = 200,
                            Data = new UserInviteData { Id = user.Id },
                            Message = "User invitation sent successfully!",
                            Success = true
                        };
                        return Ok(response);
                    }
                    else
                    {
                        var response = new UserInviteResponse
                        {
                            StatusCode = 200,
                            Errors = new List<string> { "Email sending failed!" },
                            Data = new UserInviteData { Id = user.Id },
                            Message = "User invitation has sent successfully!",
                            Success = true
                        };
                        return Ok(response);
                    }
                }
                return BadRequest(new UserInviteResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User invitation failed! Please check invite details and try again." }
                });
            }

            return BadRequest(new UserInviteResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid Invite user request." }
            });
        }

        [HttpPatch]
        [Authorize]
        [Route("delete-user/{id}")]
        public async Task<IActionResult> DeleteUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new DeletUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Identifier required" }
                });
            }

            //Check for user exists
            var userExists = await _userManager.FindByIdAsync(id);
            if (userExists == null)
            {
                return BadRequest(new DeletUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User not found!" }
                });
            }
            if(string.IsNullOrEmpty(userExists.Inviter))
            {
                return Ok(new DeletUserResponse
                {
                    Errors = new List<string> { "You are not authorized to delete this user!" },
                    Success = false
                });
            }
            var tenant = await _tenantService.GetTenantbyIdAsync(await _userService.GetTenantIdByUserName(_currentUsername));
            if(tenant.EmailAddress == userExists.Email)
            {
                return Ok(new DeletUserResponse 
                { 
                    Errors= new List<string> { "You are not authorized to delete this user!"},
                    Success=false
                });
            }
            if (userExists.EmailConfirmed)
            {
                userExists.IsDeleted = true;
                userExists.DateInactive = DateTime.Now;
                var result = await _userManager.UpdateAsync(userExists);
                if (result.Succeeded)
                {
                    var response = new DeletUserResponse
                    {
                        Data = new DeleteUserData { IsDeleted = true },
                        Message = "User deactivated successfully!",
                        Success = true,
                        StatusCode = 900

                    };
                    return Ok(response);

                }
                else
                {
                    var response = new DeletUserResponse
                    {
                        Data = new DeleteUserData { IsDeleted = false },
                        Errors = new List<string> { "User failed to delete!" },
                        Success = false
                    };
                    return Ok(response);
                }
            }
            else
            {
                var result = await _userManager.DeleteAsync(userExists);
                if (result.Succeeded)
                {
                    var response = new DeletUserResponse
                    {
                        Data = new DeleteUserData { IsDeleted = true },
                        Message = "User deleted successfully!",
                        Success = true,
                        StatusCode = 200

                    };
                    return Ok(response);

                }
                else
                {
                    var response = new DeletUserResponse
                    {
                        Data = new DeleteUserData { IsDeleted = false },
                        Errors = new List<string> { "User failed to delete!" },
                        Success = false
                    };
                    return BadRequest(response);
                }
            }
        }

        [HttpPut]
        [Authorize]
        [Route("active-user/{id}/{status}")]
        public async Task<IActionResult> DeleteUserById(string id, bool status)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new DeletUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Identifier required" }
                });
            }
            //Check for user exists
            var userExists = await _userManager.FindByIdAsync(id);
            if (userExists == null)
            {
                return BadRequest(new DeletUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User not found" }
                });
            }

            if (status)
            {
                userExists.IsDeleted = false;
                userExists.DateActive = DateTime.Now;
            }
            else
            {
                userExists.IsDeleted = true;
                userExists.DateInactive = DateTime.Now;
            }
            var result = await _userManager.UpdateAsync(userExists);
            if (!result.Succeeded)
            {
                return BadRequest(new DeletUserResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User failed to deactivate!" }
                });
            }

            return Ok(new DeletUserResponse { Data = new DeleteUserData { IsDeleted = true }, Message = "User deactivated successfully", Success = true, StatusCode = 200 });
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("available-username")]
        public async Task<IActionResult> IsUserNameExists(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest(new IsAvailableResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Username required" }
                });
            }

            var verifyUsername = await _userManager.FindByNameAsync(username);
            if (verifyUsername != null)
            {
                var response = new IsAvailableResponse
                {
                    Success = true,
                    Data = new GetIsAvaialable
                    {
                        IsAvailable = false
                    },
                    Message = "User name already taken!",
                    StatusCode = 200

                };
                return Ok(response);
            }
            else
            {
                var response = new IsAvailableResponse
                {
                    Success = true,
                    Data = new GetIsAvaialable
                    {
                        IsAvailable = true
                    },
                    Message = "User name available!",
                    StatusCode = 200

                };
                return Ok(response);
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("available-email-address")]
        public async Task<IActionResult> IsEmailExists(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new IsAvailableResponse
                {
                    Success = false,
                    Errors = new List<string>() { "Email required" }
                });
            }

            var checkEmail = await _userManager.FindByEmailAsync(email);
            if (checkEmail != null)
            {
                var response = new IsAvailableResponse
                {
                    Success = true,
                    Data = new GetIsAvaialable
                    {
                        IsAvailable = false
                    },
                    Message = "Email already taken!",
                    StatusCode = 200

                };
                return Ok(response);
            }
            else
            {
                var response = new IsAvailableResponse
                {
                    Success = true,
                    Data = new GetIsAvaialable
                    {
                        IsAvailable = true
                    },
                    Message = "Email available!",
                    StatusCode = 200

                };
                return Ok(response);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("resend-invitation")]
        public async Task<IActionResult> ResendInvitation(string email)
        {

            var verifyEmail = await _userManager.FindByEmailAsync(email);
            if (verifyEmail == null)
            {
                return BadRequest(new UserInviteResponse
                {
                    Success = false,
                    Errors = new List<string>() { "User does not exists!" }
                });
            }
            if(verifyEmail.EmailConfirmed)
            {
                var response = new UserInviteResponse
                {
                    StatusCode = 200,
                    Errors = new List<string> { "user already confirmed" },
                    Data = new UserInviteData { Id = verifyEmail.Id },
                    Success = false
                };
                return Ok(response);
            }
            //var token = HttpUtility.UrlEncode(await _userManager.GenerateEmailConfirmationTokenAsync(verifyEmail));
            string strToken = await _userManager.GenerateEmailConfirmationTokenAsync(verifyEmail);
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(strToken));
            var currentUser = await _userManager.FindByNameAsync(_currentUsername);
            var emailsend = await _emailService.InvitationEmail(currentUser.FirstName + " " + currentUser.LastName, verifyEmail.FirstName + " " + verifyEmail.LastName, verifyEmail.Email, token);
            //Remove existing Token Expiry
            await _userService.RemoveTokenExpiry(verifyEmail);
            //Add Email Exipration for token 
            await _userService.AddTokenExpiration(verifyEmail, EmailTokenType.InvitationToken);
            if (emailsend.IsSuccessStatusCode)
            {
                var response = new UserInviteResponse
                {
                    StatusCode = 200,
                    Data = new UserInviteData { Id = verifyEmail.Id },
                    Message = "User invitation sent successfully!",
                    Success = true
                };
                return Ok(response);
            }
            else
            {
                var response = new UserInviteResponse
                {
                    StatusCode = 200,
                    Errors = new List<string> { "Invitation sending failed!" },
                    Data = new UserInviteData { Id = verifyEmail.Id },
                    Success = false
                };
                return Ok(response);
            }


        }

    }
}

