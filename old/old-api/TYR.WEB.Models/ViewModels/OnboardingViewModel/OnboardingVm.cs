using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.ViewModels.AnimalTypeViewModel;
using TYR.WEB.Models.ViewModels.PCO;

namespace TYR.WEB.Models.ViewModels.OnboardingViewModel
{
    public class OnboardingVm
    {
        //Payload for API : {
        //     animalType: ['cat', 'bird', 'cow'],
        //     rescueName: ['rescue 1', 'rescue 2', 'rescue 3'],
        //     clinicHospital: ['hospital 1', 'hospital 2', 'hospital 3'],
        //    }
        // AnimalTypeVM
        // AddPCOVm  - Other Rescue
        // AddPCOVm - Clinic / Hospital
        public List<string> AnimalTypes { get; set; }
        public List<string> OtherRescuePCOs { get; set; }
        public List<string> HospitalPCOs { get; set; }
    }
}
