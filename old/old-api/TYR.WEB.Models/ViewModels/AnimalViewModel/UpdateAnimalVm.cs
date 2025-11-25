using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AnimalViewModel
{
    public class UpdateAnimalVm
    {
        //public int AssignedAnimalId { get; set; }
        public string AnimalName { get; set; }
        public bool CurrentResident { get; set; }
        public string Breed { get; set; }
        public string Color { get; set; }
        public string Sex { get; set; }
        public bool SpayedOrNeutered { get; set; }
        public string LastMilestone { get; set; }
        public DateTime? LastMilestoneDate { get; set; }
        public string Notes { get; set; }
        //public string OtherIDNo { get; set; }
        [DefaultValue(false)]
        public bool Flag { get; set; }
        public string FlagReason { get; set; }

        public string Location { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }

        public int? PcoId { get; set; }
        public int AnimalTypeId { get; set; }
        public int? TenantId { get; set; }
        public string ChronicCondition { get; set; }
        public string Status { get; set; }
    }
}
