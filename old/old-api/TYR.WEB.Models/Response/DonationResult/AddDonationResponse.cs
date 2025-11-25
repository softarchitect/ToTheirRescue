using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DonationResult
{
    public class AddDonationResponse: BaseOperationResult
    {
        public AddDonationData Data { get; set; }
    }

    public class AddDonationData
    {
        public int Id { get; set; }
        public Donation Donation { get; set; }
    }
}
