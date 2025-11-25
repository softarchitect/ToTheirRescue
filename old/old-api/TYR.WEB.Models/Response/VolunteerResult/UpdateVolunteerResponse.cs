using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerResult
{
    public class UpdateVolunteerResponse: BaseOperationResult
    {
        public UpdateVolunteerData Data { get; set; }
    }

    public class UpdateVolunteerData
    {
        public int VolunteerId { get; set; }
        //public int VolunteerPersonActivityId { get; set; }
        public Volunteer Volunteer { get; set; }
        public List<VolunteerPersonActivity> VolunteerPersonActivities { get; set; }

    }
}
