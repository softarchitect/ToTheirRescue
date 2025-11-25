using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserRoleResult
{
    public class DeleteUserRoleResponse: BaseOperationResult
    {
        public DeleteUserRoleData Data { get; set; }
    }
    
    public class DeleteUserRoleData
    {
        public bool IsDeleted { get; set; }
    }
}
