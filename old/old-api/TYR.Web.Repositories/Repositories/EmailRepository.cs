using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
namespace TYR.Web.Repositories.Repositories
{
    public class EmailRepository : IEmailRepository
    {

        private readonly IConfiguration _configuration;
        private readonly string _sendgridKey;
        private readonly EmailAddress _fromEmailAddress;
        public EmailRepository(IConfiguration configuration)
        {
            this._configuration = configuration;
            this._sendgridKey = configuration["SendGrid:SendGrid-Dev-APIKey"];
            this._fromEmailAddress = new EmailAddress(configuration["SendGrid:From"], configuration["SendGrid:FromName"]);
        }

        public async Task<Response> EmailVerification(string firstName, string email, string token)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            string invitationLink = String.Format("{0}{1}{2}&email={3}", _configuration["EmailLinks:base-url"], _configuration["EmailLinks:admin-signup-email-verification"], token, email);
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-b47ae2375c7b40bca69595443ddb6087");
            sendGridMessage.SetTemplateData(new
            {
                user = firstName,
                link = invitationLink
            });

            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }

        public async Task<Response> InvitationEmail(string inviter, string userName, string email,  string token)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            string invitationLink = String.Format("{0}{1}{2}&email={3}", _configuration["EmailLinks:base-url"], _configuration["EmailLinks:user-invitation"], token, email);
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-987c6bc1c1af4df29ad3f525d6dec877");
            sendGridMessage.SetTemplateData(new
            {
                user = userName,
                inviter,
                link = invitationLink
            });

            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }
        public async Task<Response> ForgetPassword(string userName, string email, string token)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            string invitationLink = String.Format("{0}{1}{2}&email={3}", _configuration["EmailLinks:base-url"], _configuration["EmailLinks:forget-password"], token, email);
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-5233e68ea44547ab88a7e7f970cbdfb1");
            sendGridMessage.SetTemplateData(new
            {
                UserName = userName,
                link = invitationLink
            });
            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }
        public async Task<Response> ForgetUserName(string userName, string email, string name)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-a960b99ac62349c6913bef18677c5f38");
            sendGridMessage.SetTemplateData(new
            {
                 userName,
                 name
            });
            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }

        public async Task<Response> OTPEmailVerification(string firstName, string email, string otpCode)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-ee6ecb1814df4b52b04181f8da81f8e8");
            sendGridMessage.SetTemplateData(new
            {
                //user = firstName, 
                otp = otpCode
            });

            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }

        public async Task<Response> OnboardingEmail(string firstName, string email)
        {
            var sendGridClient = new SendGridClient(new HttpClient(), new SendGridClientOptions { ApiKey = _sendgridKey, HttpErrorAsException = true });
            var sendGridMessage = new SendGridMessage();
            sendGridMessage.SetFrom(_fromEmailAddress);
            sendGridMessage.AddTo(email);
            sendGridMessage.SetTemplateId("d-067cb59a662c4b1985ce7e0a44d65aa4");
            sendGridMessage.SetTemplateData(new 
            {
                firstname = firstName
            });

            return await sendGridClient.SendEmailAsync(sendGridMessage);
        }
    }
}
