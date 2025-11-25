using System;
using System.Collections.Generic;

namespace TYR.WEB.Models.ViewModels.AnimalProcedureViewModel
{
    public class AnimalProcedureVm
    {
        public int? AnimalId { get; set; }
        public int? KindId { get; set; }
        public bool Reminder { get; set; }
        public List<DateTime?> DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Weight { get; set; }
        public string Clinic { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Administerer { get; set; }
        public string Results { get; set; }
        public string MicrochipNumber { get; set; }
        public string Notes { get; set; }
    }

    public class AnimalProcedureUpdateVm
    {
        public int? AnimalId { get; set; }
        public int? KindId { get; set; }
        public bool Reminder { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Weight { get; set; }
        public string Clinic { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Administerer { get; set; }
        public string Results { get; set; }
        public string MicrochipNumber { get; set; }
        public string Notes { get; set; }
    }

    public class AnimalProcedureListVm
    {
        public List<int> AnimalIds { get; set; }
        //public List<AnimalProcedureVm> AnimalProcedureVms { get; set; }
        public AnimalProcedureVm AnimalProcedureVm { get; set; }
    }
}
