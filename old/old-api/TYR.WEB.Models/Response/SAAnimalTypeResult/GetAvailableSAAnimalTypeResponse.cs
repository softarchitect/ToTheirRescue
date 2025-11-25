using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.WEB.Models.Response.SAAnimalTypeResult
{
    public class GetAvailableSAAnimalTypeResponse: BaseOperationResult
    {
        public GetAvailableSAAnimalTypeData Data { get; set; }
    }

    public class GetAvailableSAAnimalTypeData
    {
        public bool IsAvailable { get; set; }
    }
}
