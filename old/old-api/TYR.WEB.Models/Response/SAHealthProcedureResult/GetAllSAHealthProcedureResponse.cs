using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.WEB.Models.Response.SAHealthProcedureResult
{
    public class GetAllSAHealthProcedureResponse: BaseOperationResult
    {
        public GetAllSAHealthProceduresData Data { get; set; }
    }
    public class GetAllSAHealthProceduresData
    {
        public List<SAHealthProcedure> SAHealthProcedures { get; set; }
    }
}
