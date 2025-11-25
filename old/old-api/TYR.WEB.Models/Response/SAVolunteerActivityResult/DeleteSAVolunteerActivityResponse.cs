using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVolunteerActivityResult
{
    public class DeleteSAVolunteerActivityResponse: BaseOperationResult
    {
        public DeleteSAVolunteerActivityData Data { get; set; }
    }
    public class DeleteSAVolunteerActivityData
    {
        public bool IsDeleted { get; set; }
    }
}
