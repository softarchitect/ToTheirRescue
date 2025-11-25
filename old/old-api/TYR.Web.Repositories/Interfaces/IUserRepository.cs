using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.Response.UserResult;
namespace TYR.Web.Repositories.Interfaces
{
    public interface IUserRepository : IRepositoryBase<ApplicationUser>
    {
        // Task<UserInvitationResendResponse> ReSendInvitation(string userId);

        Task<IdentityResult> AddTokenExpiration(ApplicationUser user, string tokenType);
        Task<bool> ValidateTokenExpires(ApplicationUser user);
        Task<bool> RemoveTokenExpiry(ApplicationUser user);
    }
}
