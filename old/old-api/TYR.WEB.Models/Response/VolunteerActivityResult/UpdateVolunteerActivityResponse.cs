using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerActivityResult
{
    public class UpdateVolunteerActivityResponse : BaseOperationResult
    {
        public UpdateVolunteerActivityData Data { get; set; }
    }

    public class UpdateVolunteerActivityData
    {
        public int Id { get; set; }
        public VolunteerActivity VolunteerActivity { get; set; }
    }
}
