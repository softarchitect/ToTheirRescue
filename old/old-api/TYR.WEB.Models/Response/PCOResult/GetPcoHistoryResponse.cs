using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class GetPcoHistoryResponse: BaseOperationResult
    {
        public GetPcoHistoryData Data { get; set; }
    }

    public class GetPcoHistoryData
    {
        public List<PcoHistory> PcosHistory { get; set; }
    }

    public class PcoHistory
    {
        public int TenantId { get; set; }
        public int AnimalId { get; set; }
        public int AnimalMilestoneId { get; set; }
        public int PcoId { get; set; }
        public int DonationId { get; set; }
        public int VolunteerId { get; set; }
        public int PvdId { get; set; }
        public string TableName { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? VolDateInactive { get; set; }
        public string MilestoneAttachmentType { get; set; }
        public decimal Amount { get; set; }
        public decimal MilestoneAmountReceivedFee { get; set; }
        public string AnimalType { get; set; }
        public string AnimalName { get; set; }
        public string Notes { get; set; }
        public bool AnimalMilestoneDeleted { get; set; }
        public bool AnimalDeleted { get; set; }
        public bool DonationDeleted { get; set; }
        public bool VolunteerDeleted { get; set; }
        public bool PvdDeleted { get; set; }
    }
}
