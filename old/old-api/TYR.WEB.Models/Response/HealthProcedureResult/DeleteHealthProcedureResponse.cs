using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthProcedureResult
{
    public class DeleteHealthProcedureResponse : BaseOperationResult
    {
        public DeleteHealthProcedureData Data { get; set; }
    }

    public class DeleteHealthProcedureData
    {
        public bool IsDeleted { get; set; }
    }
}
