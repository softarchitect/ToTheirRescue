using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Models.Response.AttachmentResult;

namespace TYR.WEB.Models.ViewModels.AnimalViewModel
{
    public class AnimalResponseVm
    {
        public ListAnimalResponse animal { get; set; }
    }

    public class ListAnimalResponse 
    {
        public int Id { get; set; }
        //public int AssignedAnimalId { get; set; }
        public int AnimalId { get; set; }
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
        public int? AnimalTypeId { get; set; }
        public int? TenantId { get; set; }
        public DataAccess.Entities.PCO Pco { get; set; }
        public string AnimalType { get; set; }
        public string ChronicCondition { get; set; }
        public string Status { get; set; }

        public IntakeMilestoneVM IntakeMilestone { get; set; }
        public BirthMilestoneVM BirthMilestone { get; set; }
        public ArtifactAttachment ArtifactAttachment { get; set; }
        public AnimalMilestone AnimalMilestone { get; set; }
        public GetAttachmentCountData AttachmentCountData { get; set; }
        public AnimalMilestoneCountData AnimalMilestoneCountData { get; set; }
    }
}
