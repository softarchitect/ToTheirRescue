using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerPersonActivityResult
{
    public class DeleteVolunteerPersonActivityResponse: BaseOperationResult
    {
        public DeleteVolunteerPersonActivityData Data { get; set; }
    }

    public class DeleteVolunteerPersonActivityData
    {
        public bool IsDeleted { get; set; }
    }
}
