using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
   public class GetPCOAvailableResponse : BaseOperationResult
    {
        public GetAvailablePCOData Data { get; set; }
    }
    public class GetAvailablePCOData
    {
        public bool IsAvailable { get; set; }
    }
}
