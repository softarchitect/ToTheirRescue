using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;

namespace TYR.WEB.Models.ViewModels.MedViewModel
{
    public class MedVm
    {
        public int? MedicineId { get; set; }
        public DateTime? AdministeredDate { get; set; }
        public List<DateTime?> DueDate { get; set; }
        public string Dosage { get; set; }
        public string Notes { get; set; }
        public string AdministeredBy { get; set; }
        public int? PrescriptionRecordNo { get; set; }
        public bool Reminder { get; set; }
        public string Clinic { get; set; }
        public string Veterinarian { get; set; }
        
    }

    public class MedUpdateVm
    {
        public int? MedicineId { get; set; }
        public DateTime? AdministeredDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Dosage { get; set; }
        public string Notes { get; set; }
        public string AdministeredBy { get; set; }
        public int? PrescriptionRecordNo { get; set; }
        public bool Reminder { get; set; }
        public string Clinic { get; set; }
        public string Veterinarian { get; set; }

    }

    public class MedListVm
    {
        public List<int> AnimalIds { get; set; }
        public List<MedVm> MedVms { get; set; }
    }
}
