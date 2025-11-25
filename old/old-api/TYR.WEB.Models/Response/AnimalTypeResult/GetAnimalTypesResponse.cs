using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalTypeResult
{
    public class GetAnimalTypesResponse: BaseOperationResult
    {
        public GetAnimalTypesData Data { get; set; }
    }
    public class GetAnimalTypesData
    {
        public List<AnimalType> AnimalTypes { get; set; }
    }
}
