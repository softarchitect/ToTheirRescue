using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AcquisitionWayResult
{
    public class DeleteAcquisitionWayResponse : BaseOperationResult
    {
        public DeletedAcquisitionsWayData Data { get; set; }
    }

    public class DeletedAcquisitionsWayData
    {
        public bool IsDeleted { get; set; }
    }
}
