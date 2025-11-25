using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SendGrid;
using System.Net.Http;
using SendGrid.Helpers.Mail;
using TYR.WEB.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using TYR.Web.Repositories.Interfaces;
namespace TYR.WEB.Services.Services
{
   public class EmailService : IEmailService
    {
        private readonly IEmailRepository _emailRepository;

        public EmailService(IEmailRepository emailRepository) => _emailRepository = emailRepository;

        public async Task<Response> InvitationEmail(string inviter, string userName, string emailTo, string token) => await _emailRepository.InvitationEmail(inviter, userName, emailTo, token);
        public async Task<Response> EmailVerification(string firstName, string email, string token) => await _emailRepository.EmailVerification(firstName, email, token);
        public async Task<Response> ForgetPassword(string userName, string email, string token) => await _emailRepository.ForgetPassword(userName, email,  token);
        public async Task<Response> ForgetUserName(string userName, string email, string name) => await _emailRepository.ForgetUserName(userName, email, name);
        public async Task<Response> OnboardingEmail(string firstName, string email) => await _emailRepository.OnboardingEmail(firstName, email);
    }
}
