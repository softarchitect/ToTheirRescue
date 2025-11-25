using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.UserViewModel;
using TYR.WEB.DataAccess.IdentityAuth;
namespace TYR.WEB.Models.Response.UserResult
{
    public class UpdateUserResponse: BaseOperationResult
    {
        public UpdateUserData Data { get; set; }
        
    }
    public class UpdateUserData
    {
        public UsersVM UsersVM { get; set; }
    }
}
