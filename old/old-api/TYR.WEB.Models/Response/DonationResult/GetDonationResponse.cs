using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DonationResult
{
    public class GetDonationResponse: BaseOperationResult
    {
        public GetDonationData Data { get; set; }
    }

    public class GetDonationData
    {
        public List<DonationCustom> Donations { get; set; }
        public double TotalCount { get; set; }
    }

    public class DonationCustom
    {
        public int Id { get; set; }
        public int? PcoId { get; set; }
        public string PcoName { get; set; }
        public DateTime? DonationDate { get; set; }
        public double? Amount { get; set; }
        public string DonationType { get; set; }
        public string Notes { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }
    }
}
