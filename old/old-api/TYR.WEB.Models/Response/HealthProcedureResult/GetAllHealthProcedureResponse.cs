using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthProcedureResult
{
    public class GetAllHealthProcedureResponse : BaseOperationResult
    {
        public GetAllHealthProceduresData Data { get; set; }
    }
    public class GetAllHealthProceduresData
    {
        public List<HealthProcedure> HealthProcedures { get; set; }
    }
}
