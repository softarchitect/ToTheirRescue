using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.DonationViewModel
{
    public class DonationVm
    {
        public int? PcoId { get; set; }
        public DateTime? DonationDate { get; set; }
        public decimal? Amount { get; set; }
        public string DonationType { get; set; }
        public string Notes { get; set; }
    }
}
