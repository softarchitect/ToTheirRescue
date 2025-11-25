using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
namespace TYR.WEB.Models.Response.PCOResult
{
   public class DeletePCOResponse : BaseOperationResult
    {
        public GetDeletePCOData Data { get; set; }
    }
    public class GetDeletePCOData
    {
        public bool IsDeleted { get; set; }
    }
}
