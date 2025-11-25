using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel
{
    public class AnimalMilestoneUpdateVm
    {
        public string MilestoneType { get; set; }
        public DateTime? MilestoneDate { get; set; }
        public bool IsApproxDOB { get; set; }
        public string OtherRescueIDNo { get; set; }
        public decimal? AmountPaidFee { get; set; }
        public decimal? AmountReceivedFee { get; set; }
        public string Notes { get; set; }
        public int? AcquisitionWayId { get; set; }
        public string AcquisitionWayName { get; set; }
        public int? PCOId { get; set; }
        public int? OtherRescueShelterId { get; set; }
    }
}
