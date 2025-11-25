using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TYR.WEB.API.Responses;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.Request.TokenRequest;
using TYR.WEB.Services.Interfaces;
using TYR.WEB.Services.Services;

namespace TYR.WEB.API.CommonHelper
{
    public class Helper
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenValidationParameters _tokenValidationParams;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IConfiguration _configuration;
        private readonly ICountryService _countryService;

        public Helper(UserManager<ApplicationUser> userManager, TokenValidationParameters tokenValidationParams, IRefreshTokenService refreshTokenService, IConfiguration configuration, ICountryService countryService)
        {
            _userManager = userManager;
            _tokenValidationParams = tokenValidationParams;
            _refreshTokenService = refreshTokenService;
            _configuration = configuration;
            _countryService = countryService;
        }
        public string GeneratePassword()
        {
            var options = _userManager.Options.Password;

            int length = options.RequiredLength;

            bool nonAlphanumeric = options.RequireNonAlphanumeric;
            bool digit = options.RequireDigit;
            bool lowercase = options.RequireLowercase;
            bool uppercase = options.RequireUppercase;

            StringBuilder password = new();
            Random random = new();

            while (password.Length < length)
            {
                char c = (char)random.Next(32, 126);

                password.Append(c);

                if (char.IsDigit(c))
                    digit = false;
                else if (char.IsLower(c))
                    lowercase = false;
                else if (char.IsUpper(c))
                    uppercase = false;
                else if (!char.IsLetterOrDigit(c))
                    nonAlphanumeric = false;
            }

            if (nonAlphanumeric)
                password.Append((char)random.Next(33, 48));
            if (digit)
                password.Append((char)random.Next(48, 58));
            if (lowercase)
                password.Append((char)random.Next(97, 123));
            if (uppercase)
                password.Append((char)random.Next(65, 91));

            return password.ToString();
        }

        public async Task<AuthResponse> VerifyAndGenerateToken(RefreshTokenRequest tokenRequest)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                // Validation 1 - Validation JWT token format
                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token, _tokenValidationParams, out var validatedToken);

                // Validation 2 - Validate encryption alg
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                    if (!result)
                    {
                        return null;
                    }
                }

                // Validation 3 - validate expiry date
                var utcExpiryDate = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
                var expiryDate = CommonUtility.UnixTimeStampToDateTime(utcExpiryDate);
                if (expiryDate > DateTime.UtcNow)
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has not yet expired"
                        }
                    };
                }

                // validation 4 - validate existence of the token
                var storedToken = await _refreshTokenService.GetRefreshTokenByTokenAsync(tokenRequest.RefreshToken);

                if (storedToken == null)
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token does not exist"
                        }
                    };
                }

                // Validation 5 - validate if used
                if (storedToken.IsUsed)
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has been used"
                        }
                    };
                }

                // Validation 6 - validate if revoked
                if (storedToken.IsRevoked)
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has been revoked"
                        }
                    };
                }

                // Validation 7 - validate the id
                var jti = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

                if (storedToken.JwtId != jti)
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token doesn't match"
                        }
                    };
                }

                // update current token 
                storedToken.IsUsed = true;
                await _refreshTokenService.UpdateRefreshTokenByUsed(tokenRequest.RefreshToken, storedToken.IsUsed);

                // Generate a new token
                var dbUser = await _userManager.FindByIdAsync(storedToken.UserId);
                var userRoles = await _userManager.GetRolesAsync(dbUser);
                return await GenerateJwtToken(dbUser, userRoles);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Lifetime validation failed. The token is expired."))
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Token has expired please re-login"
                        }
                    };
                }
                else
                {
                    return new AuthResponse()
                    {
                        Success = false,
                        Errors = new List<string>() {
                            "Something went wrong."
                        }
                    };
                }
            }
        }

        public async Task<AuthResponse> GenerateJwtToken(ApplicationUser user, IList<string> userRoles)
        {
            string roleName = string.Empty;
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                roleName = string.IsNullOrEmpty(roleName) ? userRole : roleName;
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddMinutes(15), // 5-10
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature) 
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                IsUsed = false,
                IsRevoked = false,
                UserId = user.Id,
                AddedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddMonths(6),
                Token = CommonUtility.RandomString(35) + Guid.NewGuid()
            };

            await _refreshTokenService.AddAsync(refreshToken);

            int countryId = user.Tenant != null && user.Tenant.CountryId.HasValue ? user.Tenant.CountryId.Value : 0;
            var country = await _countryService.GetByIdAsync(countryId);
            return new AuthResponse()
            {
                Token = jwtToken,
                Success = true,
                RefreshToken = refreshToken.Token,
                Data = new UserData { 
                    FirstName = user.FirstName, 
                    LastName = user.LastName, 
                    UserName = user.UserName, 
                    RoleName = roleName, 
                    TenantId = user.TenantId, 
                    CountryId = countryId, 
                    CountryName = country != null && country.Data.Country != null ? country.Data.Country.CountryName : string.Empty,
                    CountryISO2Code = country != null && country.Data.Country != null ? country.Data.Country.ISO2Code : string.Empty
                }
            };
        }

        //public async Task<ValidPasswordResponse> ValidatePassword(string password)
        public ValidPasswordResponse ValidatePassword(string password)
        {
            var input = password;
            if (string.IsNullOrWhiteSpace(input))
            {
                throw new Exception("Password should not be empty");
            }

            var hasNumber = new Regex(@"[0-9]+");
            var hasUpperChar = new Regex(@"[A-Z]+");
            var hasMiniMaxChars = new Regex(@".{8,16}");
            var hasLowerChar = new Regex(@"[a-z]+");
            var hasSymbols = new Regex(@"[@$!%*#^_<>?&().-]");

            if (!hasLowerChar.IsMatch(input))
            {
                return new ValidPasswordResponse()
                {
                    Success= false,
                    Error = "Password should contain at least one lower case letter."
                };
                
            }
            else if (!hasUpperChar.IsMatch(input))
            {
                return new ValidPasswordResponse()
                {
                    Success = false,
                    Error = "Password should contain at least one upper case letter."
                };
               
            }
            else if (!hasMiniMaxChars.IsMatch(input))
            {
                return new ValidPasswordResponse()
                {
                    Success = false,
                    Error = "Password should not be lesser than 8 or greater than 15 characters."
                };
               
            }
            else if (!hasNumber.IsMatch(input))
            {
                return new ValidPasswordResponse()
                {
                    Success = false,
                    Error = "Password should contain at least one numeric value."
                };
              
            }

            else if (!hasSymbols.IsMatch(input))
            {
                return new ValidPasswordResponse()
                {
                    Success = false,
                    Error = "Password should contain at least one special case character."
                };
                
            }
            else
            {
                return new ValidPasswordResponse()
                {
                    Success = true,
                    Error = "Password validated!"
                };
            }
        }
    }
}
