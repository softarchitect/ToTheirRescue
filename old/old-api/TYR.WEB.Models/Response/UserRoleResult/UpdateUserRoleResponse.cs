using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserRoleResult
{
    public class UpdateUserRoleResponse: BaseOperationResult
    {
        public UpdateUserRoleData Data { get; set; }
    }
    
    public class UpdateUserRoleData
    {
        public string Id { get; set; }
        public IdentityRole IdentityRole { get; set; }
    }
}
