using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SABehaviorResult
{
    public class AddSABehaviorResponse : BaseOperationResult
    {
        public int Id { get; set; }
        public AddSABehaviorData Data { get; set; }
    }

    public class AddSABehaviorData
    {
        public int Id { get; set; }
    }
}
