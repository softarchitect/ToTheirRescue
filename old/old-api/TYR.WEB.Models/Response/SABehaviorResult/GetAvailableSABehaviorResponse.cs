using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SABehaviorResult
{
    public class GetAvailableSABehaviorResponse : BaseOperationResult
    {
        public GetAvailableSABehaviorData Data { get; set; }
    }

    public class GetAvailableSABehaviorData
    {
        public bool IsAvailable { get; set; }
    }
}
