using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;

namespace TYR.WEB.Models.ViewModels.DiaryViewModel
{
    public class DiaryVm
    {
        //public string TenantOrAnimal { get; set; } // TenantOrAnimal – this identifies if the entry is for an animal or the tenant  - nvarchar(6), not null – allowable values are ‘tenant’ and ‘animal’
        public DateTime? ActionDate { get; set; }
        public string Notes { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class DiaryListVm
    {
        public List<int> AnimalIds { get; set; }
        public string EntityType { get; set; }
        public DiaryVm DiaryVm { get; set; }
    }
}
