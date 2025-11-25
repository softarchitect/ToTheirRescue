using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAHealthProcedureResult
{
    public class UpdateSAHealthProcedureResponse: BaseOperationResult
    {
        public UpdateSAHealthProcedureData Data { get; set; }
    }
    public class UpdateSAHealthProcedureData
    {
        public int Id { get; set; }
        public SAHealthProcedure SAHealthProcedure { get; set; }
    }
}
