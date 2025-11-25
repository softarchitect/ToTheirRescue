using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserResult
{
    public class UserInvitationResendResponse : BaseOperationResult
    {
        public UserInvitedData Data { get; set; }
    }
    public class UserInvitedData
    {
        public string Email { get; set; }
    }
}
