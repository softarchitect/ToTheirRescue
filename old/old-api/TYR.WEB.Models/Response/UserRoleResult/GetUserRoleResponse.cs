using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserRoleResult
{
    public class GetUserRoleResponse: BaseOperationResult
    {
        public GetUserRoleData Data { get; set; }
    }
    public class GetUserRoleData
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
