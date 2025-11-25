using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AnimalBehaviorViewModel
{
    public class AnimalBehaviorVm
    {
        public int? BehaviorId { get; set; }
        //public int? AnimalId { get; set; }
        public bool YesOrNo { get; set; }
        public string Notes { get; set; }
    }

    public class AnimalBehaviorListVm
    {
        public List<int> AnimalIds { get; set; }
        public List<AnimalBehaviorVm> AnimalBehaviorVms { get; set; }
    }
}
