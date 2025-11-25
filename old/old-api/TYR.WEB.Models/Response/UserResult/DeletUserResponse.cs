using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserResult
{
    public class DeletUserResponse : BaseOperationResult
    {
        public DeleteUserData Data { get; set; }
    }

    public class DeleteUserData
    {
    public bool IsDeleted { get; set; }
    }
} 