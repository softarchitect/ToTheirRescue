using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.BehaviorResult
{
    public class DeleteBehaviorResponse : BaseOperationResult
    {
        public DeleteBehaviorData Data { get; set; }
    }

    public class DeleteBehaviorData
    {
        public bool IsDeleted { get; set; }
    }
}
