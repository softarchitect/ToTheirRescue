using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedResult
{
    public class UpdateMedGivenResponse : BaseOperationResult
    {
        public UpdateMedGivenData Data { get; set; }
    }

    public class UpdateMedGivenData
    {
        public int Id { get; set; }
        public Med Med { get; set; }
    }

    public class UpdateMedGivenListResponse : BaseOperationResult
    {
        public UpdateMedGivenListData Data { get; set; }
    }

    public class UpdateMedGivenListData
    {
        public List<UpdateMedGivenData> MedGivensData { get; set; }
    }
}
