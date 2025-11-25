using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedResult
{
    public class UpdateMedResponse: BaseOperationResult
    {
        public UpdateMedData Data { get; set; }
    }

    public class UpdateMedData
    {
        public int Id { get; set; }
        public Med Med { get; set; }
    }
}
