using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerActivityResult
{
    public class DeleteVolunteerActivityResponse : BaseOperationResult
    {
        public DeleteVolunteerActivityData Data { get; set; }
    }

    public class DeleteVolunteerActivityData
    {
        public bool IsDeleted { get; set; }
    }
}
