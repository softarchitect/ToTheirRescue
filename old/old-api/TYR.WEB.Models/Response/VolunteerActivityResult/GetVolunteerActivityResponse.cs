using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerActivityResult
{
    public class GetVolunteerActivityResponse : BaseOperationResult
    {
        public GetVolunteerActivityData Data { get; set; }
    }
    public class GetVolunteerActivityData
    {
        public List<VolunteerActivity> VolunteerActivities { get; set; }
    }
}
