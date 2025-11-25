using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AcquisitionWayResult
{
    public class GetAvailableAcquisitionWayResponse: BaseOperationResult
    {
        public GetAvailableAnimalAcquisitionData Data { get; set; }
    }

    public class GetAvailableAnimalAcquisitionData
    {
        public bool IsAvailable { get; set; }
    }
}
