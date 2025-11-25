using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVolunteerActivityResult
{
    public class GetSAVolunteerActivityResponse: BaseOperationResult
    {
        public GetSAVolunteerActivityData Data { get; set; }
    }
    public class GetSAVolunteerActivityData
    {
        public List<SAVolunteerActivity> SAVolunteerActivities { get; set; }
    }
}
