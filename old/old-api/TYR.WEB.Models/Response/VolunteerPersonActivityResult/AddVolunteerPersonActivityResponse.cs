using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerPersonActivityResult
{
    public class AddVolunteerPersonActivityResponse: BaseOperationResult
    {
        public AddVolunteerPersonActivityData Data { get; set; }
    }

    public class AddVolunteerPersonActivityData
    {
        public VolunteerPersonActivity VolunteerPersonActivity { get; set; }
    }
}
