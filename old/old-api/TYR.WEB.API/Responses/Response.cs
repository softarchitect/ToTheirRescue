using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TYR.WEB.API.Responses
{
    public class Response
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
        //public string Message2 { get; set; }
    }
}
