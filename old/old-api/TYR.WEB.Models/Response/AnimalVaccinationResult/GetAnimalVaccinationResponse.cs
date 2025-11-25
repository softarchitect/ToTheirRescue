using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;


namespace TYR.WEB.Models.Response.AnimalVaccinationResult
{
    public class GetAnimalVaccinationResponse : BaseOperationResult
    {
        public GetAnimalVaccinationData Data { get; set; }
    }
    public class GetAnimalVaccinationData
    {
        public List<AnimalVaccinationCustom> AnimalVaccinations { get; set; }
    }

    public class AnimalVaccinationCustom
    {
        public int Id { get; set; }
        public int KindId { get; set; }
        public int AnimalId { get; set; }
        public string AnimalName { get; set; }
        public string AnimalType { get; set; }
        public int? AnimalTypeId { get; set; }
        public string VaccinationKind { get; set; }
        public bool Reminder { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public int HospitalClinicId { get; set; }
        public string HospitalClinic { get; set; }
        public string Administerer { get; set; }
        public string TagNumber { get; set; }
        public string VaccineManufacturer { get; set; }
        public string VaccineSerialNo { get; set; }
        //public DateTime? VaccineExpirationDate { get; set; }
        public string Notes { get; set; }
        public string DueAgain { get; set; }
        public string VaccRecordNo { get; set; }
        public DateTime? DateEntered { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int TenantId { get; set; }
    }

    public class GetVaccinationResponse : BaseOperationResult
    {
        public GetVaccinationData Data { get; set; }
    }

    public class GetVaccinationData
    {
        public List<AnimalVaccination> AnimalVaccinations { get; set; }
    }

    public class GetAllAnimalVaccinationResponse: BaseOperationResult
    {
        public GetAllAnimalVaccinationData Data { get; set; }
    }

    public class GetAllAnimalVaccinationData
    {
        public int Count { get; set; }
        public List<AnimalVaccinationCustom> AnimalVaccinations { get; set; }
    }
}
