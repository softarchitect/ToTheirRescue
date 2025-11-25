using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.PCOResult;
using TYR.WEB.Models.Response.AnimalResult;

namespace TYR.WEB.Models.Response.DashBoardResult
{
    public class DashBoardCountResponse : BaseOperationResult
    {
        public GetDashBoardCount Data { get; set; }

    }
    public class GetDashBoardCount
    {
        public GetPCOCount PCOCount { get; set; }
        public GetAnimalCount AnimalCount { get; set; }
    }
}
