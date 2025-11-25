using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.WEB.Models.Response.SAHealthProcedureResult
{
    public class AddSAHealthProcedureResponse: BaseOperationResult
    {
        public int Id { get; set; }
        public AddSAHealthProcedureDataData Data { get; set; }
    }

    public class AddSAHealthProcedureDataData
    {
        public int Id { get; set; }
    }
}
