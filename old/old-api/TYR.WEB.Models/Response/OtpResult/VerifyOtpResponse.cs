using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.OtpResult
{
    public class VerifyOtpResponse: BaseOperationResult
    {
        public VerifyOtpData Data { get; set; }
    }

    public class VerifyOtpData
    {
        public bool OtpVerified { get; set; }
    }
}
