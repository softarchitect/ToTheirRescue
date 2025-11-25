using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.OtpResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class OtpService : IOtpService
    {
        private readonly IOtpRepository _otpRepository;
        public OtpService(IOtpRepository otpRepository)
        {
            _otpRepository = otpRepository;
        }
        public async Task<GenerateOtpResponse> GenerateOtpAsync(OTP oTP, string firstName) => await _otpRepository.GenerateOtpAsync(oTP, firstName);
        
        public async Task<VerifyOtpResponse> VerifyOtpAsync(string email, string code, string userName) => await _otpRepository.VerifyOtpAsync(email, code, userName);
        public async Task<VerifyOtpResponse> CheckEmailOtpVerifiedAsync(string email) => await _otpRepository.CheckEmailOtpVerifiedAsync(email);
    }
}
