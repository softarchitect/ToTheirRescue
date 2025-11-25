using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserResult
{
    public class UserInviteResponse : BaseOperationResult
    {
        public UserInviteData Data { get; set; }
    }

    public class UserInviteData
    {
        public string Id { get; set; }
    }
}
