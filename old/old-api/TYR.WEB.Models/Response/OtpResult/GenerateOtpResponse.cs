using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.OtpResult
{
    public class GenerateOtpResponse: BaseOperationResult
    {
        public GenerateOtpData Data { get; set; }
    }

    public class GenerateOtpData
    {
        //public string OtpCode { get; set; }
        public bool Success { get; set; }
    }
}
