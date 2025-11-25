using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.VolunteerViewModel
{
    public class VolunteerVm
    {
        public DateTime DateActive { get; set; }
        public DateTime? DateInactive { get; set; }
        public string Notes { get; set; }
        public bool Active { get; set; }
        public int? PcoId { get; set; }
        public List<int?> VolunteerActivityIds { get; set; }
    }
}
