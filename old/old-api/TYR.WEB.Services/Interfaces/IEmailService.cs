using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SendGrid;

namespace TYR.WEB.Services.Interfaces
{
    public interface IEmailService
    {
        Task<Response> InvitationEmail(string inviter, string userName, string email, string token);
        Task<Response> EmailVerification(string firstName, string email, string token);
        Task<Response> ForgetPassword(string userName, string email,  string token);
        Task<Response> ForgetUserName(string userName, string email, string name);
        Task<Response> OnboardingEmail(string firstName, string email);
    }
}
