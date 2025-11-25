using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SendGrid;
using System.Net.Http;
using SendGrid.Helpers.Mail;
namespace TYR.Web.Repositories.Interfaces
{
    public interface IEmailRepository
    {
        Task<Response> InvitationEmail(string inviter, string userName, string email,  string token);
        Task<Response> EmailVerification(string firstName, string email, string verificationLink);
        Task<Response> ForgetPassword(string userName, string email,  string token);
        Task<Response> ForgetUserName(string userName, string email, string name);
        Task<Response> OTPEmailVerification(string firstName, string email, string otpCode);
        Task<Response> OnboardingEmail(string firstName, string email);
    }
}
