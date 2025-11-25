using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.UserViewModel;

namespace TYR.WEB.Models.Response.UserResult
{
    public class GetUserResponse : BaseOperationResult
    {
        public GetUserData Data { get; set; }

    }

    public class GetUserData
    {
        public UsersVM UsersVM { get; set; }
    }
}
