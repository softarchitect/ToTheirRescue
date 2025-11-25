using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthProcedureResult
{
    public class AddHealthProcedureResponse : BaseOperationResult
    {
        public int Id { get; set; }
        public AddHealthProcedureDataData Data { get; set; }
    }

    public class AddHealthProcedureDataData
    {
        public int Id { get; set; }
    }
}
