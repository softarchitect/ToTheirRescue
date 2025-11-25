using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalProcedureResult
{
    public class DeleteAnimalProcedureResponse: BaseOperationResult
    {
        public DeleteAnimalProcedureData Data { get; set; }
    }

    public class DeleteAnimalProcedureData
    {
        public bool IsDeleted { get; set; }
    }
}
