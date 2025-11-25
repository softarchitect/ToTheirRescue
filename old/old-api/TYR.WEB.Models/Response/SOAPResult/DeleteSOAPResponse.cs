using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SOAPResult
{
    public class DeleteSOAPResponse: BaseOperationResult
    {
        public DeleteSOAPData Data { get; set; }
    }

    public class DeleteSOAPData
    {
        public bool IsDeleted { get; set; }
    }
}
