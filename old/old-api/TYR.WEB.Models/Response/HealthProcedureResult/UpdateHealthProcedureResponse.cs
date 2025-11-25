using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthProcedureResult
{
    public class UpdateHealthProcedureResponse : BaseOperationResult
    {
        public UpdateHealthProcedureData Data { get; set; }
    }

    public class UpdateHealthProcedureData
    {
        public int Id { get; set; }
        public HealthProcedure HealthProcedure { get; set; }
    }
}
