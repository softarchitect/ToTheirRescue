using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class GetAnimalDietResponse: BaseOperationResult
    {
        public GetAnimalDietData Data { get; set; }
    }

    public class GetAnimalDietData
    {
        public string Diet { get; set; }
    }
}
