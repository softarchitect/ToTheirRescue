using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AcquisitionWayResult
{
    public class GetAllAcquisitionWayResponse : BaseOperationResult
    {
        public GetAllAcquisitionWayData Data { get; set; }
    }
    public class GetAllAcquisitionWayData
    {
        public List<AcquisitionWay> AcquisitionWays { get; set; }
    }
}
