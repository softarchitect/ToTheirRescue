using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.ViewModels.DiaryViewModel;

namespace TYR.WEB.Models.ViewModels.SOAPViewModel
{
    public class SOAPVm
    {
        public DateTime? ActionDate { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string SOAPPlan { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Veterinarian { get; set; }
    }

    public class SOAPListVm
    {
        public List<int> AnimalIds { get; set; }
        public SOAPVm SOAPVm { get; set; }
    }
}
