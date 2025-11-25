using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.OtpResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IOtpService
    {
        Task<GenerateOtpResponse> GenerateOtpAsync(OTP oTP, string firstName);
        Task<VerifyOtpResponse> VerifyOtpAsync(string email, string code, string userName);
        Task<VerifyOtpResponse> CheckEmailOtpVerifiedAsync(string email);
    }
}
