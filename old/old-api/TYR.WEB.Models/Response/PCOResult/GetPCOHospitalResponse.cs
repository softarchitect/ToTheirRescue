using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class GetPCOHospitalResponse : BaseOperationResult
    {
        public GetPCOHospital Data { get; set; }
    }
    public class GetPCOHospital
    {
        public List<PCOHospital> PCOHospitals { get; set; }
    }

    public class PCOHospital
    {
        public int Id { get; set; }
        public string LastNameHospital { get; set; }
    }
}
