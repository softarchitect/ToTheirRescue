using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DonationResult
{
    public class UpdateDonationResponse: BaseOperationResult
    {
        public UpdateDonationData Data { get; set; }
    }

    public class UpdateDonationData
    {
        public int Id { get; set; }
        public Donation Donation { get; set; }
    }
}
