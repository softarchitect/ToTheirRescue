using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DonationResult
{
    public class DeleteDonationResponse: BaseOperationResult
    {
        public DeleteDonationData Data { get; set; }
    }

    public class DeleteDonationData
    {
        public bool IsDeleted { get; set; }
    }
}
