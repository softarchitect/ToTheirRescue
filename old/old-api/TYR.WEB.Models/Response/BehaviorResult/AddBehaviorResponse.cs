using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.BehaviorResult
{
    public class AddBehaviorResponse : BaseOperationResult
    {
        public int Id { get; set; }
        public AddBehaviorData Data { get; set; }
    }

    public class AddBehaviorData
    {
        public int Id { get; set; }
    }
}
