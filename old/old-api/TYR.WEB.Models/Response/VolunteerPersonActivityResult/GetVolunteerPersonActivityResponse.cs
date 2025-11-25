using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerPersonActivityResult
{
    public class GetVolunteerPersonActivityResponse: BaseOperationResult
    {
        public GetVolunteerPersonActivityData Data { get; set; }
    }

    public class GetVolunteerPersonActivityData
    {
        public List<VolunteerPersonActivity> VolunteerPersonActivities { get; set; }
    }
}
