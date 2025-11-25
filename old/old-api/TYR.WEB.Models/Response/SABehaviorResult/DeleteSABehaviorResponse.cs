using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SABehaviorResult
{
    public class DeleteSABehaviorResponse : BaseOperationResult
    {
        public DeleteSABehaviorData Data { get; set; }
    }

    public class DeleteSABehaviorData
    {
        public bool IsDeleted { get; set; }
    }
}
