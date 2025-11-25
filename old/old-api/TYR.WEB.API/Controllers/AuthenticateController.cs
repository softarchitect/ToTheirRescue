using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.ViewModels.SignUp;
using TYR.WEB.API.Responses;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.ViewModels.SignIn;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Models.ViewModels.Password;
using Microsoft.AspNetCore.Cors;
using TYR.WEB.Models.ViewModels.UserViewModel;
using TYR.WEB.API.CommonHelper;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Request.TokenRequest;
using AutoMapper;
using TYR.WEB.DataAccess.SeedData;
using System.Web;
using TYR.WEB.Models.Response.TenantResult;
using SendGrid;

namespace TYR.WEB.API.Controllers
{
    [Route("api/authenticate")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITenantService _tenantService;
        private readonly TokenValidationParameters _tokenValidationParams;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IAcquisitionWayService _acquisitionWayService;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;
        private readonly ICountryService _countryService;
        private readonly ISAMedicineService _saMedicineService;
        private readonly ISAVolunteerActivityService _saVolunteerActivityService;
        private readonly IMedicineService _medicineService;
        private readonly IVolunteerActivityService _volunteerActivityService;
        private readonly IOtpService _otpService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;

        public AuthenticateController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, ITenantService tenantService,
            TokenValidationParameters tokenValidationParams,
            IRefreshTokenService refreshTokenService,
            IConfiguration configuration, IMapper mapper,
            IAcquisitionWayService acquisitionWayService,
            IEmailService emailService,
            IUserService userService,
            ICountryService countryService, 
            ISAMedicineService saMedicineService, 
            ISAVolunteerActivityService saVolunteerActivityService,
            IMedicineService medicineService,
            IVolunteerActivityService volunteerActivityService,
            IOtpService otpService,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tenantService = tenantService;
            _tokenValidationParams = tokenValidationParams;
            _refreshTokenService = refreshTokenService;
            _configuration = configuration;
            _mapper = mapper;
            _acquisitionWayService = acquisitionWayService;
            _emailService = emailService;
            _userService = userService;
            _countryService = countryService;
            _saMedicineService = saMedicineService;
            _saVolunteerActivityService = saVolunteerActivityService;
            _medicineService = medicineService;
            _volunteerActivityService = volunteerActivityService;
            _httpContextAccessor = httpContextAccessor;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _otpService = otpService;
        }

        #region Commented Code which should be delete later
        //[HttpPost]
        //[Route("signup")]
        //public async Task<IActionResult> SignUp([FromBody] SignUpVm model)
        //{

        //    // Check Tenant already exist or not?
        //    if (await _tenantService.GetTenantByNameAsync(model.TenantVm.Name) != null)
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Tenant already exists!" });

        //    // Check User already exist or not?
        //    var userExists = await _userManager.FindByNameAsync(model.Username);
        //    if (userExists != null)
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

        //    var tenantModel = _mapper.Map<Tenant>(model.TenantVm);
        //    // Create Tenant
        //    var tenantResult = await _tenantService.CreateTenantAsync(tenantModel);
        //    if (tenantResult != null && tenantResult.Success.Equals(false))
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Tenant creation failed! Please check tenant details and try again." });

        //    // Create User
        //    ApplicationUser user = new ApplicationUser()
        //    {
        //        Email = model.Email,
        //        SecurityStamp = Guid.NewGuid().ToString(),
        //        UserName = model.Username,
        //        FirstName = model.FirstName,
        //        LastName = model.LastName,
        //        AlternateEmailAddress = model.AlternateEmailAddress,
        //        Notes = model.Notes,
        //        TenantId = tenantResult != null ? tenantResult.Data.Id : 0

        //    };
        //    var result = await _userManager.CreateAsync(user, model.Password);
        //    if (!result.Succeeded)
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
        //    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        //} 
        #endregion

        [HttpPost]
        [Route("signup-admin")]
        public async Task<IActionResult> SignUpAdmin([FromBody] SignUpVm model)
        {
            if (ModelState.IsValid)
            {
                var tenantModel = _mapper.Map<Tenant>(model.TenantVm);
                // Check Tenant Already exists? By name?
                // Check Tenant already exist or not?
                
                int countryId = tenantModel.CountryId.HasValue ? tenantModel.CountryId.Value : 0;
                Helper helper = new(_userManager, _tokenValidationParams, _refreshTokenService, _configuration, _countryService);
                var passwordvalidation = helper.ValidatePassword(model.Password);
                if (passwordvalidation.Success == false)
                {
                    return Ok( new Responses.Response { Success = false, Status = "Error", Message = passwordvalidation.Error });
                }
                try
                {
                    if (await _tenantService.GetTenantByNameStateCountry(tenantModel.Name, tenantModel.State, countryId) != null)
                        //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Rescue already exists!" });
                        return BadRequest(new Responses.Response
                        {
                            Success = false,
                            Status = "Error",
                            Message = "Rescue already exists!"
                        });

                    // Check User already exist or not?
                    var userExists = await _userManager.FindByNameAsync(model.Username);
                    if (userExists != null)
                    {
                        //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Username already exists!" });
                        return BadRequest(new Responses.Response
                        {
                            Success = false,
                            Status = "Error",
                            Message = "Username already exists!"
                        });
                    }
                    else
                    {
                        // If user not found by Username then try with Email Address
                        userExists = await _userManager.FindByEmailAsync(model.Email);
                        if (userExists != null)
                            //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "User email already exists!" });
                            return BadRequest(new Responses.Response
                            {
                                Success = false,
                                Status = "Error",
                                Message = "User email already exists!"
                            });
                    }
                }
                catch (Exception ex)
                {
                    string message = ex.Message;
                    //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong for rescue and user registration!", Message2 = "Failed at checking user and rescue: " + ex.Message });
                    return BadRequest(new Responses.Response
                    {
                        Success = false,
                        Status = "Error",
                        Message = "Oops! Something wrong for rescue and user registration!"
                    });
                }

                var tenantResult = new CreateTenantResponse();
                try
                {
                    // Create Tenant
                    tenantModel.EnteredBy = model.Username;
                    tenantModel.DateEntered = DateTime.Now;
                    tenantModel.Status = model.Status; //"Registered";
                    tenantModel.IsDeleted = false;

                    tenantResult = await _tenantService.CreateTenantAsync(tenantModel);
                    if (tenantResult != null && !tenantResult.Success)
                        //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Rescue creation failed! Please check rescue details and try again." });
                        return BadRequest(new Responses.Response
                        {
                            Success = false,
                            Status = "Error",
                            Message = "Rescue creation failed! Please check rescue details and try again."
                        });
                }
                catch (Exception ex)
                {
                    string message = ex.Message;
                    //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong for rescue entry!", Message2 = "Error occurred at rescue entry: " + ex.Message });
                    return BadRequest(new Responses.Response
                    {
                        Success = false,
                        Status = "Error",
                        Message = "Oops! Something wrong for rescue entry!"
                    });
                }

                int tenantId = tenantResult != null && tenantResult.Data != null && tenantResult.Success ? tenantResult.Data.Id : 0;
                // User Instance
                ApplicationUser user = new ApplicationUser()
                {
                    PhoneNumber = model.PhoneNumber,
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Username,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    AlternateEmailAddress = model.AlternateEmailAddress,
                    Notes = model.Notes,
                    TenantId = tenantId,
                    DateEntered = DateTime.Now,
                    EnteredBy = model.Username,
                    Status = "Active"  // The status to be stored is either ‘Trialer’ or ‘Active’ based on the button that was clicked to get to this screen.
                };

                try
                {
                    // Create User associated with Tenant
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (!result.Succeeded)
                    {
                        await _tenantService.DeleteAsync(tenantId);
                        //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "User creation failed! Please check user details and try again." });
                        return BadRequest(new Responses.Response
                        {
                            Success = false,
                            Status = "Error",
                            Message = "User creation failed! Please check user details and try again."
                        });
                    }

                    // Check OTP confirmation - if confirmed then enable email confirmation in users table
                    var vOtpResponse = await _otpService.CheckEmailOtpVerifiedAsync(model.Email);
                    if(vOtpResponse != null && vOtpResponse.Success && vOtpResponse.Data.OtpVerified)
                    {
                        // Update EmailConfirmed field TRUE in Users table
                        var vUser = await _userManager.FindByEmailAsync(user.Email);
                        if (vUser != null) { 
                            vUser.EmailConfirmed = true;
                            vUser.Status = "Active";
                            vUser.DateActive = DateTime.Now;
                            await _userManager.UpdateAsync(vUser);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Delete tenant entry
                    await _tenantService.DeleteAsync(tenantId);
                    //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong for user entry.", Message2 = "Error occurred at user entry: " + ex.Message });
                    string error = ex.Message;
                    return BadRequest(new Responses.Response
                    {
                        Success = false,
                        Status = "Error",
                        Message = "Oops! Something wrong for user entry."
                    });
                }


                try
                {
                    if (!await _roleManager.RoleExistsAsync(UserRoles.Administrator))
                        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Administrator)); // The role to be stored is ‘Administrator’
                    // Ash - Need to work based on Role selected - for now updating Administrator to fix the error
                    //if (!await _roleManager.RoleExistsAsync(UserRoles.Regular))
                    //    await _roleManager.CreateAsync(new IdentityRole(UserRoles.Regular));
                    if (await _roleManager.RoleExistsAsync(UserRoles.Administrator))
                    {
                        await _userManager.AddToRoleAsync(user, UserRoles.Administrator);
                    }

                    //if (!await _roleManager.RoleExistsAsync(UserRoles.SuperAdministrator))
                    //    await _roleManager.CreateAsync(new IdentityRole(UserRoles.SuperAdministrator)); // The role to be stored is ‘Administrator’
                    //if (await _roleManager.RoleExistsAsync(UserRoles.SuperAdministrator))
                    //{
                    //    await _userManager.AddToRoleAsync(user, UserRoles.SuperAdministrator);
                    //}
                }
                catch (Exception ex)
                {
                    // Delete tenant and users from both tables
                    await _userManager.DeleteAsync(user);
                    await _tenantService.DeleteAsync(tenantId);
                    // Sending real message for error while sending email in Message 2 for reference where it is failing
                    //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong for rescue and user entry.", Message2 = "Error occurred at adding roles: " + ex.Message });
                    string error = ex.Message;
                    return BadRequest(new Responses.Response
                    {
                        Success = false,
                        Status = "Error",
                        Message = "Oops! Something wrong for rescue and user entry."
                    });
                }


                var vEmailConfirmedUser = await _userManager.FindByEmailAsync(user.Email);
                if (vEmailConfirmedUser != null && vEmailConfirmedUser.EmailConfirmed.Equals(false))
                {
                    try
                    {
                        string strToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(strToken));
                        //Add Email Exipration for token 
                        await _userService.AddTokenExpiration(user, EmailTokenType.SignUpToken);
                        //var token = HttpUtility.UrlEncode(await _userManager.GenerateEmailConfirmationTokenAsync(user));
                        await _emailService.EmailVerification(user.FirstName + " " + user.LastName, user.Email, token);
                    }
                    catch (Exception ex)
                    {
                        string error = ex.Message;
                        // Delete tenant and users from both tables
                        await _userManager.DeleteAsync(user);
                        await _tenantService.DeleteAsync(tenantId);
                        // Sending real message for error while sending email in Message 2 for reference where it is failing
                        //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong for sending verification email. Please try again.", Message2 = "Error occurred at sending verification email: " + ex.Message });
                        return BadRequest(new Responses.Response
                        {
                            Success = false,
                            Status = "Error",
                            Message = "Oops! Something wrong for sending verification email. Please try again."
                        });
                    }
                }
                
                

                try
                {
                    // Seeding 4 Acquisition Ways for every tenant and read only
                    AcquisitionWaySeed seed = new AcquisitionWaySeed();
                    var lstWays = await seed.AddAcquisitionWayList(user.UserName, tenantId);
                    foreach (var ways in lstWays)
                    {
                        await _acquisitionWayService.AddAcquisitionWayAsync(ways);
                    }

                    // Get Super Admin Medicines and add into Rescue Customization Medicines
                    var saMedResult = await _saMedicineService.GetAllSAMedicinesAsync(false);
                    if (saMedResult != null && saMedResult.Success)
                    {
                        foreach (var saMed in saMedResult.Data.Medicines)
                        {
                            var availableMedicineResult = await _medicineService.AvailableMedicines(false, saMed.MedicineName, tenantId);
                            if(availableMedicineResult != null && availableMedicineResult.Success && availableMedicineResult.Data.IsAvailable)
                            {
                                var medicine = new Medicine()
                                {
                                    DateEntered = DateTime.Now,
                                    DateModified = DateTime.Now,
                                    EnteredBy = _userName,
                                    Formulation = saMed.Formulation,
                                    IsDeleted = false,
                                    MedicineName = saMed.MedicineName,
                                    ModifiedBy = _userName,
                                    MonthlyMed = saMed.MonthlyMed,
                                    Notes = saMed.Notes,
                                    TenantId = tenantId,
                                    UsedFor = saMed.UsedFor
                                };
                                await _medicineService.AddMedicineAsync(medicine);
                            }
                        }
                    }

                    // Get Super Admin Volunteer Activities and add into Volunteer Activities
                    var saVolunteerActivities = await _saVolunteerActivityService.GetAllSAVolunteerActivitiesAsync(false);
                    if(saVolunteerActivities != null && saVolunteerActivities.Success)
                    {
                        foreach (var saVolunteerActivity in saVolunteerActivities.Data.SAVolunteerActivities)
                        {
                            var availableVolunteerActivityResult = await _volunteerActivityService.AvailableVolunteerActivities(false, saVolunteerActivity.SAVolunteerActivityName, tenantId);
                            if(availableVolunteerActivityResult != null && availableVolunteerActivityResult.Success && availableVolunteerActivityResult.Data.IsAvailable)
                            {
                                var volunteerActivity = new VolunteerActivity()
                                {
                                    DateEntered = DateTime.Now,
                                    DateModified = DateTime.Now,
                                    EnteredBy = _userName,
                                    IsDeleted = false,
                                    ModifiedBy = _userName,
                                    TenantId = tenantId,
                                    VolunteerActivityName = saVolunteerActivity.SAVolunteerActivityName
                                };
                                await _volunteerActivityService.AddVolunteerActivityAsync(volunteerActivity);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Sending real message for error while sending email in Message 2 for reference where it is failing
                    //return Ok(new Responses.Response { Success = true, Status = "Success", Message = "User added successfully!", Message2 = "Acquisition Way failed: " + ex.Message });
                    string error = ex.Message;
                    return Ok(new Responses.Response { Success = true, Status = "Success", Message = "User added successfully!" });
                }
                
                return Ok(new Responses.Response { Success = true, Status = "Success", Message = "User added successfully!" });
            }

            //return StatusCode(StatusCodes.Status400BadRequest, new Responses.Response { Success = false, Status = "Error", Message = "Invalid signup payload!" });
            return BadRequest(new Responses.Response
            {
                Success = false,
                Status = "Error",
                Message = "Invalid signup payload!"
            });
        }

        [HttpPost]
        [Route("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInVm model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Username);
                if (user != null && user.TenantId > 0)
                {
                    if(!await _userManager.CheckPasswordAsync(user, model.Password))
                    {
                        return BadRequest(new AuthResponse
                        {
                            Success = false,
                            Errors = new List<string>() {
                                "Invalid credentials."
                            }
                        });
                    }
                    var tenant = await _tenantService.GetTenantbyIdAsync(user.TenantId);
                    if (tenant != null && tenant.IsDeleted.Equals(true))
                    {
                        return BadRequest(new AuthResponse
                        {
                            Success = false,
                            Errors = new List<string>() {
                                "Unauthorized! Rescue has locked. Please contact site administrator."
                            }
                        });
                    }
                    
                    if(!user.EmailConfirmed)
                    {
                        return BadRequest(new AuthResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "Check your email to verify your email address." }
                        });
                    }
                    if (user.IsDeleted)
                    {
                        return BadRequest(new AuthResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "User is not valid." }
                        });
                    }
                    if (user.Status.ToLower()!="active")
                    {
                        return BadRequest(new AuthResponse
                        {
                            Success = false,
                            Errors = new List<string>() { "User is not active." }
                        });
                    }

                    user.Tenant = tenant;
                    var userRoles = await _userManager.GetRolesAsync(user);
                    Helper helper = new Helper(_userManager, _tokenValidationParams, _refreshTokenService, _configuration, _countryService);
                    var authResponse = await helper.GenerateJwtToken(user, userRoles);
                    return Ok(authResponse);
                }

                var result = Unauthorized();
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Errors = new List<string>() {
                        "Invalid Credentials.",
                        result.StatusCode.ToString()
                    }
                });
            }

            return BadRequest(new AuthResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid signin payload" }
            });
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest tokenRequest)
        {
            if (ModelState.IsValid)
            {
                Helper helper = new Helper(_userManager, _tokenValidationParams, _refreshTokenService, _configuration, _countryService);
                var result = await helper.VerifyAndGenerateToken(tokenRequest);

                if (result == null)
                {
                    return BadRequest(new AuthResponse()
                    {
                        Errors = new List<string>() { "Invalid token" },
                        Success = false
                    });
                }

                return Ok(result);
            }

            return BadRequest(new AuthResponse()
            {
                Success = false,
                Errors = new List<string>() {
                    "Invalid payload"
                }
            });
        }

        [HttpPost]
        [Route("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordVm model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.CurrentPassword))
            {
                if ((await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword)).Succeeded)
                {
                    return Ok(new Responses.Response { Status = "Success", Message = "Password has changed successfully!" });
                }
                //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Status = "Error", Message = "Password changed failed! Please try again." });
                return BadRequest(new Responses.Response
                {
                    Success = false,
                    Status = "Error",
                    Message = "Password changed failed! Please try again."
                });
            }
            //return Unauthorized();
            return BadRequest(new Responses.Response
            {
                Success = false,
                Status = "Error",
                Message = "Unauthorized! Password not changed"
            });
        }
        
        [HttpPost]
        [Route("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string userName, string email)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userName);
                if(user == null)
                {
                    return Ok(new Responses.Response { Success = false, Message = "User does not exist." });
                }
                if ((!user.IsDeleted) && user.Email == email && user.Status.ToLower().Trim() == "active")
                {
                    var _token = HttpUtility.UrlEncode(await _userManager.GeneratePasswordResetTokenAsync(user));
                    await _emailService.ForgetPassword(user.FirstName +" " + user.LastName, user.Email, _token);
                    return Ok(new Responses.Response { Success = true, Status = "Success", Message = "The password reset step has sent to your registered email. Please check you inbox." });
                }
                else
                {
                    return Ok(new Responses.Response { Success = false,  Message = "User inactive or deleted" });
                }

            }
            catch (Exception ex)
            {
                return Ok(new Responses.Response { Success = false, Message=ex.InnerException.ToString()});
            }
        }

        [HttpPost]
        [Route("forgot-username")]
        public async Task<IActionResult> ForgotUsername(string email)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    var tenant = await _tenantService.GetTenantbyIdAsync(user.TenantId);
                    if(tenant ==null)
                    {
                        return Ok(new Responses.Response { Success = false, Message = "Rescue does not exist" });
                    }
                    if((tenant.IsDeleted== true ) && (tenant.Status.ToLower().Trim() != "active" || tenant.Status.ToLower().Trim() != "trialer"))
                    {
                        return Ok(new Responses.Response { Success = false, Message = "Rescue is not active or deleted!" });
                    }
                    if ((!user.IsDeleted) && user.Status.ToLower().Trim() == "active")
                    {
                        await _emailService.ForgetUserName(user.UserName,  user.Email, user.FirstName + " " + user.LastName);
                        return Ok(new Responses.Response { Success = true, Status = "Success", Message = "Please check you inbox" });
                    }
                    else
                    {
                        return Ok(new Responses.Response { Success = true, Message = "User inactive or deleted" });
                    }
                }
                else
                {
                    return Ok(new Responses.Response { Success = true, Message = "User does not exist" });
                }

            }
            catch (Exception ex)
            {
                return Ok(new Responses.Response { Success = false, Message = ex.InnerException.ToString() });
            }
        }
        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordVm resetPasswordVm)
        {
            if (!ModelState.IsValid)
                //return StatusCode(StatusCodes.Status500InternalServerError, new Responses.Response { Success = false, Status = "Error", Message = "Oops! Something wrong in user reset password!" });
                return BadRequest(new Responses.Response
                {
                    Success = false,
                    Status = "Error",
                    Message = "Oops! Something wrong in user reset password!"
                });
            var user = await _userManager.FindByEmailAsync(resetPasswordVm.Email);
            if (user == null)
                return Ok(new Responses.Response { Success = false, Message = "User does not exist" });
            var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordVm.Token, resetPasswordVm.Password);
            if (!resetPassResult.Succeeded)
            {
                string errormsg = string.Empty;
                foreach (var error in resetPassResult.Errors)
                {
                    errormsg =  error.Description;
                }
                return Ok(new Responses.Response { Success = false, Message = errormsg });

            }
            else
            {
                return Ok(new Responses.Response { Success = true, Message = "Password updated successfully!"});
            }
        }

        #region Commented Code
        //public async Task<IActionResult> InviteUser([FromBody] InviteUserVm model)
        //{
        //    // Find by Username
        //    var userExists = await userManager.FindByNameAsync(model.Username);
        //    if (userExists != null)
        //    {
        //        return StatusCode(StatusCodes.Status302Found, new Response { Status = "Error", Message = "Username already taken! Please try with other username." });
        //    }

        //    // If user not found by Username then try with Email Address
        //    userExists = await userManager.FindByEmailAsync(model.EmailAddress);
        //    if (userExists != null)
        //        return StatusCode(StatusCodes.Status302Found, new Response { Status = "Error", Message = "Email already taken! Please try with other email." });

        //    // User Instance
        //    ApplicationUser user = new ApplicationUser()
        //    {
        //        Email = model.EmailAddress,
        //        SecurityStamp = Guid.NewGuid().ToString(),
        //        UserName = model.Username,
        //        FirstName = model.FirstName,
        //        LastName = model.LastName,
        //        TenantId = model.TenantId,
        //        DateEntered = DateTime.Now,
        //        EnteredBy = model.Username,
        //        Status = "Invitee’"  // Invitee’.
        //    };
        //    // Create User associated with Tenant
        //    var result = await userManager.CreateAsync((user, model.Password);


        //} 
        #endregion

        [HttpGet]
        [Route("check-email-available")]
        public async Task<IActionResult> CheckEmailAvailable(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Email address required!" });
            }
            try
            {
                // Check with Email Address
                var emailExist = await _userManager.FindByEmailAsync(email);
                if (emailExist != null)
                {
                    return Ok(new Responses.Response
                    {
                        Success = false,
                        Status = "Success",
                        Message = "Email not available!"
                    });
                }
                else
                {
                    return Ok(new Responses.Response
                    {
                        Success = true,
                        Status = "Success",
                        Message = "Email available!"
                    });
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Error occurred during checking email address availability" });
            }
        }

        [HttpGet]
        [Route("check-username-available")]
        public async Task<IActionResult> CheckUsernameAvailable(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Username required!" });
            }
            try
            {
                // Check with Username
                var userExist = await _userManager.FindByNameAsync(username);
                if (userExist != null)
                {
                    return Ok(new Responses.Response
                    {
                        Success = false,
                        Status = "Success",
                        Message = "Username not available!"
                    });
                }
                else
                {
                    return Ok(new Responses.Response
                    {
                        Success = true,
                        Status = "Success",
                        Message = "Username available!"
                    });
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Error occurred during checking username availability" });
            }
        }

        [HttpGet]
        [Route("check-rescue-available")]
        public async Task<IActionResult> CheckRescueAvailable(string rescueName, string state, int? countryId)
        {
            if (string.IsNullOrEmpty(rescueName))
            {
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Username required!" });
            }

            int iCountryId = countryId.HasValue ? countryId.Value : 0;
            state = string.IsNullOrEmpty(state) ? string.Empty : state.Trim();
            
            try
            {
                // Check with Rescue
                var rescueExist = await _tenantService.GetTenantByNameStateCountry(rescueName, state, iCountryId);
                if (rescueExist != null)
                {
                    return Ok(new Responses.Response
                    {
                        Success = false,
                        Status = "Success",
                        Message = "Rescue not available!"
                    });
                }
                else
                {
                    return Ok(new Responses.Response
                    {
                        Success = true,
                        Status = "Success",
                        Message = "Rescue available!"
                    });
                }
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return BadRequest(new Responses.Response { Success = false, Status = "Error", Message = "Error occurred during checking rescue availability" });
            }
        }
    }
}
