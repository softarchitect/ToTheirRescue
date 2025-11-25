using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class PCOCountResponse : BaseOperationResult
    {
        public GetPCOCount Data { get; set; }
    }
    public class GetPCOCount
    {
        public int PersonCount { get; set; }
        public int OrganizationCount { get; set; }
    }
}
