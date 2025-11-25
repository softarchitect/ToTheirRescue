using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TYR.WEB.API.Responses
{
    public class AuthResponse
    {
        public UserData Data { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public bool Success { get; set; }
        public List<string> Errors { get; set; }
    }

    public class UserData
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RoleName { get; set; }
        public int TenantId { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public string CountryISO2Code { get; set; }
    }
}
