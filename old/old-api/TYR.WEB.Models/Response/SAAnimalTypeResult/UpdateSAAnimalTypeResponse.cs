using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAAnimalTypeResult
{
    public class UpdateSAAnimalTypeResponse: BaseOperationResult
    {
        public UpdateSAAnimalTypeData Data { get; set; }
    }

    public class UpdateSAAnimalTypeData
    {
        public int Id { get; set; }
        public SAAnimalType SAAnimalType { get; set; }
    }
}
