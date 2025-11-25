using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVolunteerActivityResult
{
    public class GetAvailableSAVolunteerActivityResponse: BaseOperationResult
    {
        public GetAvailableSAVolunteerActivityData Data { get; set; }
    }
    public class GetAvailableSAVolunteerActivityData
    {
        public bool IsAvailable { get; set; }
    }
}
