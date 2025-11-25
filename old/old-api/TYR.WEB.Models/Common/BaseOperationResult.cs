using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.Common
{
    public class BaseOperationResult: IBaseOperationResult
    {
        public string Message { get; set; }
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public List<string> Errors { get; set; }
    }
}
