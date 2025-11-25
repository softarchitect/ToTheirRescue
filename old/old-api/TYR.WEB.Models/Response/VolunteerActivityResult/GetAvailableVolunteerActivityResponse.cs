using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerActivityResult
{
    public class GetAvailableVolunteerActivityResponse : BaseOperationResult
    {
        public GetAvailableVolunteerActivityData Data { get; set; }
    }

    public class GetAvailableVolunteerActivityData
    {
        public bool IsAvailable { get; set; }
    }
}
