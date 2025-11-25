using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVaccinationTypeResult
{
    public class GetAvailableSAVaccinationTypeResponse: BaseOperationResult
    {
        public GetAvailableSAVaccinationTypeData Data { get; set; }
    }
    public class GetAvailableSAVaccinationTypeData
    {
        public bool IsAvailable { get; set; }
    }
}
