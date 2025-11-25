using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalTypeResult
{
    public class GetAvailableAnimalTypeResponse : BaseOperationResult
    {
        public GetAvailableAnimalTypeData Data { get; set; }
    }

    public class GetAvailableAnimalTypeData
    {
        public bool IsAvailable { get; set; }
    }
}
