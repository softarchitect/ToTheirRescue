using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.BehaviorResult
{
    public class GetAvailableBehaviorResponse : BaseOperationResult
    {
        public GetAvailableBehaviorData Data { get; set; }
    }

    public class GetAvailableBehaviorData
    {
        public bool IsAvailable { get; set; }
    }
}
