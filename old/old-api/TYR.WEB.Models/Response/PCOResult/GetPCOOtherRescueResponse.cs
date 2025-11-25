using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class GetPCOOtherRescueResponse : BaseOperationResult
    {
        public GetPCOOtherRescueData Data { get; set; }
    }
    public class GetPCOOtherRescueData
    {
        public List<PCOOtherRescue> PCOOtherRescues { get; set; }
    }

    public class PCOOtherRescue
    {
        public int Id { get; set; }
        public string LastNameOtherRescue { get; set; }
    }
}
