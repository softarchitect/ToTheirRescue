using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserRoleResult
{
    public class AddUserRoleResponse: BaseOperationResult
    {
        public AddUserRoleData Data { get; set; }
    }
    public class AddUserRoleData
    {
        public string Name { get; set; }
        public string Success { get; set; }
        public bool Result { get; set; } 
        public String Id { get; set; }
    }
}
