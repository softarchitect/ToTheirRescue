using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AcquisitionWayResult
{
    public class AddAcquisitionWayResponse : BaseOperationResult
    {
        public AddAcquisitionWayData Data { get; set; }
    }

    public class AddAcquisitionWayData
    {
        public int Id { get; set; }
    }
}
