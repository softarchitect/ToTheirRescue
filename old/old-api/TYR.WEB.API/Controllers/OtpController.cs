using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.OtpResult;
using TYR.WEB.Models.ViewModels.OnboardingViewModel;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.API.Controllers
{
    //[Authorize]
    [Route("api/otp")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly IOtpService _otpService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _userName;
        private readonly IUserService _userService;
        protected readonly UserManager<ApplicationUser> _userManager;

        public OtpController(IOtpService otpService, IHttpContextAccessor httpContextAccessor, IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _otpService = otpService;
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("otp-generate")]
        public async Task<IActionResult> OtpGeneration(string email, string firstName)
        {
            if(string.IsNullOrEmpty(email))
            {
                return BadRequest(new GenerateOtpResponse
                {
                    Errors = new List<string> { "Email is required" },
                    StatusCode = 400,
                    Success = false
                });
            }

            if (ModelState.IsValid)
            {
                //var tenantId = await _userService.GetTenantIdByUserName(_userName);
                //var user = await _userService.GetUserByEmail(email);
                //if(user != null && string.IsNullOrEmpty(firstName))
                //{
                //    firstName = user.FirstName;
                //}

                var otp = new OTP()
                {
                    Email = email,
                    DateEntered = DateTime.Now,
                    EnteredBy = email,
                    IsEmailOtpVerified = false,
                    //TenantId = user != null ? user.TenantId : 0
                };
                
                var response = await _otpService.GenerateOtpAsync(otp, firstName);
                if(response.Success) return Ok(response);

                return BadRequest(response);
            }

            return BadRequest(new GenerateOtpResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid code generation request." }
            });
        }

        [HttpPost]
        [Route("otp-verify")]
        public async Task<IActionResult> VerifyOtp(string email, string otp)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new VerifyOtpResponse
                {
                    Errors = new List<string> { "Email is required" },
                    StatusCode = 400,
                    Success = false
                });
            }

            if (ModelState.IsValid)
            {
                //var user = await _userService.GetUserByEmail(email);
                
                //int tenantId = user != null ? user.TenantId : 0;
                //string userName = user != null ? user.UserName : string.Empty;
                var response = await _otpService.VerifyOtpAsync(email, otp, email);
                if (response.Success) return Ok(response);
                //{
                //    user.Status = "Active";
                //    user.DateActive = DateTime.Now;
                //    user.EmailConfirmed = true;
                //    var confirmedResponse = await _userManager.UpdateAsync(user);
                //    if (confirmedResponse.Succeeded) { }

                //}

                return BadRequest(response);
            }

            return BadRequest(new VerifyOtpResponse
            {
                Success = false,
                Errors = new List<string>() { "Invalid verification code request." }
            });
        }
    }
}
