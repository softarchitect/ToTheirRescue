using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.Response.VolunteerResult
{
    public class GetVolunteerResponse
    {
        public GetVolunteerData Data { get; set; }
    }

    public class GetVolunteerData
    {
        public VolunteerPersonCustom VolunteerPersonCustom { get; set; }
    }
}
