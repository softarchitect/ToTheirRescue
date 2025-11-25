using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.WEB.Models.Response.SAHealthProcedureResult
{
    public class DeleteSAHealthProcedureResponse: BaseOperationResult
    {
        public DeleteSAHealthProcedureData Data { get; set; }
    }
    public class DeleteSAHealthProcedureData
    {
        public bool IsDeleted { get; set; }
    }
}
