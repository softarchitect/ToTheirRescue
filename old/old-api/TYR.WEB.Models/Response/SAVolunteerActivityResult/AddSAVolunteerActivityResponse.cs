using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVolunteerActivityResult
{
    public class AddSAVolunteerActivityResponse: BaseOperationResult
    {
        public AddSAVolunteerActivityData Data { get; set; }
    }
    public class AddSAVolunteerActivityData
    {
        public int Id { get; set; }
    }
}
