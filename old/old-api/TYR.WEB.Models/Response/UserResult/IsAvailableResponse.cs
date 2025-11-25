using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.UserResult
{
   public  class IsAvailableResponse : BaseOperationResult
    {
        public GetIsAvaialable Data { get; set; }
    }
    public class GetIsAvaialable
    {
        public bool IsAvailable { get; set; }
    }
}
