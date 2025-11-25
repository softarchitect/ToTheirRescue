using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalVaccinationResult;

namespace TYR.WEB.Models.Response.MedResult
{
    public class GetMedResponse: BaseOperationResult
    {
        public GetMedData Data { get; set; }
    }

    public class GetMedData
    {
        public List<MedCustom> Meds { get; set; }
    }

    public class MedCustom
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public string AnimalName { get; set; }
        public string AnimalType { get; set; }
        public int? AnimalTypeId { get; set; }
        public int PrescriptionRecordNo { get; set; }
        public DateTime? AdministeredDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Medicine { get; set; }
        public int? MedicineId { get; set; }
        public string Dosage { get; set; }
        public string Notes { get; set; }
        public string AdministeredBy { get; set; }
        public bool Reminder { get; set; }
        public string Clinic { get; set; }
        public string Veterinarian { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }

    }

    public class GetAllMedResponse : BaseOperationResult
    {
        public GetAllMedData Data { get; set; }
    }

    public class GetAllMedData
    {
        public int Count { get; set; }
        public List<MedCustom> Meds { get; set; }
    }
}
