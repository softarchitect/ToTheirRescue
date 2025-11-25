using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.DataAccess;
using Microsoft.AspNetCore.Http;


namespace TYR.WEB.API.Controllers
{
    public static  class UserManagerExtensions
    {
        public static async Task<List<ApplicationUser>> GetUserByTenantIdAsync(this UserManager<ApplicationUser> userManager, int tenantId)
        {
            return await userManager?.Users?.Where(x => x.TenantId == tenantId && x.IsDeleted == false).ToListAsync();
        }
        public static async Task<int> GetTenanatId(this UserManager<ApplicationUser> userManager, string usreName)
        {
            var userDetails =  await userManager.FindByNameAsync(usreName);
            return userDetails.TenantId;
        }
        

    }
}
