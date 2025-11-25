using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalProcedureResult
{
    public class UpdateAnimalProcedureResponse : BaseOperationResult
    {
        public UpdateAnimalProcedureData Data { get; set; }
    }

    public class UpdateAnimalProcedureData
    {
        public int Id { get; set; }
        public AnimalProcedure AnimalProcedure { get; set; }
    }
}
