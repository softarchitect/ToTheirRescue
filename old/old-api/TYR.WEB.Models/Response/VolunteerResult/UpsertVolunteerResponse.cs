using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerResult
{
    public class UpsertVolunteerResponse: BaseOperationResult
    {
        public UpsertVolunteerData Data { get; set; }
    }
    public class UpsertVolunteerData
    {
        public Volunteer Volunteer { get; set; }
        public List<VolunteerPersonActivity> VolunteerPersonActivities { get; set; }
    }
}
