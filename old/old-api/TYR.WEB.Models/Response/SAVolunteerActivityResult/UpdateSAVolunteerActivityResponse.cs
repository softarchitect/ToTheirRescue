using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAVolunteerActivityResult
{
    public class UpdateSAVolunteerActivityResponse: BaseOperationResult
    {
        public UpdateSAVolunteerActivityData Data { get; set; }
    }
    public class UpdateSAVolunteerActivityData
    {
        public int Id { get; set; }
        public SAVolunteerActivity SAVolunteerActivity { get; set; }
    }
}
