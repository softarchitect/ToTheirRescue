using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel
{
    public class AnimalMilestoneVm
    {
        public string MilestoneType { get; set; }
        public DateTime? MilestoneDate { get; set; }
        public bool IsApproxDOB { get; set; }
        public string OtherRescue { get; set; }
        public string OtherRescueIDNo { get; set; }
        public int? OtherRescueShelterId { get; set; }
        public decimal? AmountPaidFee { get; set; }
        public decimal? AmountReceivedFee { get; set; }
        public string Notes { get; set; }
        public DateTime? DateEntered { get; set; } = DateTime.Now;
        public DateTime? DateModified { get; set; } = DateTime.Now;
        public string EnteredBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? AcquisitionWayId { get; set; }
        public int? PcoId { get; set; }
        public int? AnimalId { get; set; }
        public int? TenantId { get; set; }
    }
}
