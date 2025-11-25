using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.DataAccess.IdentityAuth;
using TYR.WEB.Models.ViewModels.UserViewModel;
namespace TYR.WEB.Models.Response.UserResult
{
    public class GetUserListResponse : BaseOperationResult
    {
        public GetUserListData Data { get; set; }
    }

    public class GetUserListData
    {
        public List<UsersVM> UsersVMs { get; set; }
    }
}
