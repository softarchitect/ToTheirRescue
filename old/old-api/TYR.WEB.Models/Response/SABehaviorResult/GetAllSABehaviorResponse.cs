using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SABehaviorResult
{
    public class GetAllSABehaviorResponse : BaseOperationResult
    {
        public GetAllSABehaviorsData Data { get; set; }
    }
    public class GetAllSABehaviorsData
    {
        public List<SABehavior> SABehaviors { get; set; }
    }
}
