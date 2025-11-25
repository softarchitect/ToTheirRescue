using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.WEB.Models.Response.SAAnimalTypeResult
{
    public class GetSAAnimalTypeResponse: BaseOperationResult
    {
        public GetSAAnimalTypesData Data { get; set; }
    }

    public class GetSAAnimalTypesData
    {
        public List<SAAnimalType> SAAnimalTypes { get; set; }
    }
}
