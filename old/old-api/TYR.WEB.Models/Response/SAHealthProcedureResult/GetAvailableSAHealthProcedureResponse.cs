using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAHealthProcedureResult
{
    public class GetAvailableSAHealthProcedureResponse: BaseOperationResult
    {
        public GetAvailableSAHealthProceduresData Data { get; set; }
    }
    public class GetAvailableSAHealthProceduresData
    {
        public bool IsAvailable { get; set; }
    }
}
