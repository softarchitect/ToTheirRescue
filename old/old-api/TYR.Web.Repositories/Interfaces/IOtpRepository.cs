using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.OtpResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IOtpRepository: IRepositoryBase<OTP>
    {
        Task<GenerateOtpResponse> GenerateOtpAsync(OTP oTP, string firstName);
        string OtpGeneration();
        Task<VerifyOtpResponse> VerifyOtpAsync(string email, string code, string userName);
        Task<VerifyOtpResponse> CheckEmailOtpVerifiedAsync(string email);
    }
}
