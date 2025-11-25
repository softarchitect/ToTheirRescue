using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserRoleResult
{
    public class GetUserRolesResponse: BaseOperationResult
    {
        public GetUserRolesData Data { get; set; }
    }

    public class GetUserRolesData 
    {
        public List<IdentityRole> Roles { get; set; }
    }
}
