using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthProcedureResult
{
    public class GetAvailableHealthProcedureResponse : BaseOperationResult
    {
        public GetAvailableHealthProceduresData Data { get; set; }
    }

    public class GetAvailableHealthProceduresData
    {
        public bool IsAvailable { get; set; }
    }
}
