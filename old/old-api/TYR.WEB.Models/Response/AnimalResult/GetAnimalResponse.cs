using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class GetAnimalResponse: BaseOperationResult
    {
        public GetAnimalData Data { get; set; }
    }

    public class GetAnimalData
    {
        public Animal Animal { get; set; }
    }
}
