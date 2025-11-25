using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;

namespace TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel
{
    public class AnimalVaccinationVm
    {
        public int? KindId { get; set; }
        public bool Reminder { get; set; }
        public List<DateTime?> DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Administerer { get; set; }
        public string TagNumber { get; set; }
        public string VaccineManufacturer { get; set; }
        public string VaccineSerialNo { get; set; }
        //public DateTime? VaccineExpirationDate { get; set; }
        public string Notes { get; set; }
        public string DueAgain { get; set; }
        //public string VaccRecordNo { get; set; }
    }

    public class AnimalVaccinationUpdateVm
    {
        public int? KindId { get; set; }
        public bool Reminder { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Administerer { get; set; }
        public string TagNumber { get; set; }
        public string VaccineManufacturer { get; set; }
        public string VaccineSerialNo { get; set; }
        //public DateTime? VaccineExpirationDate { get; set; }
        public string Notes { get; set; }
        public string DueAgain { get; set; }
    }

    public class AnimalVaccinationListVm
    {
        public List<int> AnimalIds { get; set; }
        public List<AnimalVaccinationVm> AnimalVaccinationVm { get; set; }
    }
}
