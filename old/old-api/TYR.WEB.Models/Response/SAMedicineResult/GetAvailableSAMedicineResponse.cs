using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAMedicineResult
{
    public class GetAvailableSAMedicineResponse: BaseOperationResult
    {
        public GetAvailableSAMedicineData Data { get; set; }
    }
    public class GetAvailableSAMedicineData
    {
        public bool IsAvailable { get; set; }
    }
}
