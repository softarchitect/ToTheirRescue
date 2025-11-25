using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedResult
{
    public class DeleteMedResponse: BaseOperationResult
    {
        public DeleteMedData Data { get; set; }
    }

    public class DeleteMedData
    {
        public bool IsDeleted { get; set; }
    }
}
