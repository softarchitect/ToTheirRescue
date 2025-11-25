
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AcquisitionWayResult
{
    public class UpdateAcquisitionWayResponse : BaseOperationResult
    {
        public UpdateAnimalAcquisitionData Data { get; set; }
    }

    public class UpdateAnimalAcquisitionData
    {
        public int Id { get; set; }
        public AcquisitionWay AcquisitionWay { get; set; }
    }

}
