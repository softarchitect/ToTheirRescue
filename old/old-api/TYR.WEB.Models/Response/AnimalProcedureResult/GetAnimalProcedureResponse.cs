using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalVaccinationResult;

namespace TYR.WEB.Models.Response.AnimalProcedureResult
{
    public class GetAnimalProcedureResponse : BaseOperationResult
    {
        public GetAnimalProcedureData Data { get; set; }
    }
    public class GetAnimalProcedureData
    {
        public List<AnimalProcedureCustom> AnimalProcedures { get; set; }
    }

    public class AnimalProcedureCustom
    {
        public int Id { get; set; }
        public int KindId { get; set; }
        public int AnimalId { get; set; }
        public string AnimalName { get; set; }
        public string AnimalType { get; set; }
        public int? AnimalTypeId { get; set; }
        public string HealthProcedureKind { get; set; }
        public bool Reminder { get; set;}
        public DateTime? DueDate { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Weight { get; set; }
        public int HospitalClinicId { get; set;}
        public string HospitalClinic { get; set; }
        public string Administerer { get; set; }
        public string Results { get; set;}
        public string MicrochipNumber { get; set; }
        public string Notes { get; set; }
        public DateTime? DateEntered { get; set; }
        public string ModifiedBy { get; set;}
        public bool IsDeleted { get; set; }
        public int TenantId { get; set; }
    }

    public class GetAllAnimalProcedureResponse : BaseOperationResult
    {
        public GetAllAnimalProcedureData Data { get; set; }
    }

    public class GetAllAnimalProcedureData
    {
        public int Count { get; set; }
        public List<AnimalProcedureCustom> AnimalProcedures { get; set; }
    }
}
