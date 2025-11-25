using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;

namespace TYR.WEB.Models.ViewModels.AnimalViewModel
{
    public class AnimalVm
    {
        public AddAnimalVM animal { get; set; }
        public IntakeMilestoneVM intakeMilestone { get; set; }
        public BirthMilestoneVM birthMilestone { get; set; }
    }
}
