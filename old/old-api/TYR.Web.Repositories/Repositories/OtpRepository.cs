using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DonationResult;
using TYR.WEB.Models.Response.OtpResult;
using TYR.WEB.Models.ViewModels.DonationViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class OtpRepository : RepositoryBase<OTP>, IOtpRepository
    {
        private readonly TYRDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly string _userName;
        private readonly IEmailRepository _emailRepository;
        public OtpRepository(TYRDbContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IEmailRepository emailRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _emailRepository = emailRepository;
        }
        public async Task<GenerateOtpResponse> GenerateOtpAsync(OTP oTP, string firstName)
        {
            try
            {
                // Check email that has already verified or not
                var emailVerified = _dbContext.OTPs.Where(e => e.Email.Equals(oTP.Email) && e.IsEmailOtpVerified.Equals(true)).FirstOrDefault();
                if (emailVerified != null)
                {
                    return new GenerateOtpResponse
                    {
                        Errors = new List<string> { "Email has already verified with verify code." },
                        StatusCode = 400,
                        Success = false
                    };
                }


                var vOtp = new OTP();
                
                var recordExist = _dbContext.OTPs.Where(e => e.Email.Equals(oTP.Email)).FirstOrDefault();
                if(recordExist != null)
                {   // Update if already exist
                    recordExist.DateModified = DateTime.Now;
                    recordExist.OtpCode = OtpGeneration();
                    vOtp = await base.UpdateAsync(recordExist);
                }
                else
                {   // Add new record
                    oTP.OtpCode = OtpGeneration();
                    vOtp = await base.AddAsync(oTP);
                }

                await _dbContext.SaveChangesAsync();

                // Send Email with verify code
                try
                {
                    var otpResponse = await _emailRepository.OTPEmailVerification(firstName, vOtp.Email, vOtp.OtpCode);
                    if(!otpResponse.IsSuccessStatusCode) // Not successfully send an email with verify code
                    {
                        return new GenerateOtpResponse
                        {
                            Errors = new List<string> { "Oops! Something went wrong while sending verify code" },
                            StatusCode = 400,
                            Success = false
                        };
                    }
                }
                catch (Exception ex)
                {
                    return new GenerateOtpResponse
                    {
                        Errors = new List<string> { "Oops! Something went wrong while sending verify code", ex.InnerException.ToString() },
                        StatusCode = 400,
                        Success = false
                    };
                }
               

                return new GenerateOtpResponse
                {
                    Data = new GenerateOtpData { Success = true },
                    Message = "Verify code generated successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GenerateOtpResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while generating verify code", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public string OtpGeneration()
        {
            string characters = "1234567890";
            string otp = string.Empty;
            for(int i=0; i < 6; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }
            return otp;
        }

        public async Task<VerifyOtpResponse> VerifyOtpAsync(string email, string otpCode, string userName)
        {
            try
            {
                var vOtp = await _dbContext.OTPs.Where(o => o.Email.Equals(email) && o.OtpCode.Equals(otpCode)).OrderByDescending(o => o.DateEntered).FirstOrDefaultAsync();
                if (vOtp != null)
                {
                    vOtp.IsEmailOtpVerified = true;
                    vOtp.DateModified = DateTime.UtcNow;
                    vOtp.ModifiedBy = userName;

                    var entity = await base.UpdateAsync(vOtp);
                    await _dbContext.SaveChangesAsync();

                    return new VerifyOtpResponse
                    {
                        Data = new VerifyOtpData { OtpVerified = vOtp.IsEmailOtpVerified },
                        Message = "Verify code verified successfully",
                        StatusCode = 200,
                        Success = true
                    };
                }
                else
                {
                    return new VerifyOtpResponse
                    {
                        Errors = new List<string> { "Invalid verify code" },
                        StatusCode = 400,
                        Success = false
                    };
                }
            }
            catch (Exception ex)
            {
                return new VerifyOtpResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while verify code", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<VerifyOtpResponse> CheckEmailOtpVerifiedAsync(string email)
        {
            try
            {
                var vOtp = await _dbContext.OTPs.Where(o => o.Email.Equals(email) && o.IsEmailOtpVerified.Equals(true)).FirstOrDefaultAsync();
                if (vOtp != null)
                {
                    return new VerifyOtpResponse
                    {
                        Data = new VerifyOtpData { OtpVerified = true },
                        Message = "Email has verified with code",
                        StatusCode = 200,
                        Success = true
                    };
                }

                return new VerifyOtpResponse
                {
                    Data = new VerifyOtpData { OtpVerified = false },
                    Message = "Email has not verified with code",
                    StatusCode = 200,
                    Success = false
                };

            }
            catch (Exception ex)
            {
                return new VerifyOtpResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking verified code email", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
