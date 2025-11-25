using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.ReportResult
{
    public class GetAnimalHealthReportResponse: BaseOperationResult
    {
        public GetAnimalHealthReportData Data { get; set; }
    }

    public class GetAnimalHealthReportData
    {
        //public AnimalHealthReport AnimalHealthReports { get; set; }
        public  TenantReport TenantReport { get; set; }
        public AnimalReport AnimalReport { get; set; }
        public ChronicConditonReport ChronicConditonReport { get; set; }
        public DietReport DietReport { get; set; }
        public List<ReminderReport> ReminderReports { get; set; }
        public List<VaccinationReport> VaccinationReports { get; set; }
        public List<HealthChronologyReport> HealthChronologyReports { get; set; }
    }

    public class TenantReport
    {
        //Columns from the Tenants table
        //Name
        //Street
        //City
        //State
        //Zip
        //Phone
        public int Id { get; set; }
        public string Name { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
    }

    public class AnimalReport
    {
        //AnimalName
        //AnimalID
        //AnimalTypeName
        //Sex
        //Breed
        //Color
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int AnimalMilestoneId { get; set; }
        public string AnimalName { get; set; }
        public int AnimalId { get; set; }
        public string AnimalTypeName { get; set; }
        public string Sex { get; set; }
        public string Breed { get; set; }
        public string Color { get; set; }
        public DateTime? BirthDate { get; set; }
        public bool IsApproxDOB { get; set; }
        public bool IsDeleted { get; set; }
        public string MilestoneType { get; set; }
    }

    public class ChronicConditonReport
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string ChronicCondition { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class DietReport
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string Diet { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class ReminderReport
    {
        public int ReminderId { get; set; }
        public int AnimalId { get; set; }
        public int TenantId { get; set; }
        public bool Reminder { get; set; }
        public DateTime? DueDate { get; set; }
        public string Kind { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class VaccinationReport
    {
        public int VaccinationId { get; set; }
        public int AnimalId { get; set; }
        public int TenantId { get; set; }
        public string VaccinationKind { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Clinic { get; set; }
        public string Practitioner { get; set; }
        public string TagNumber { get; set; }
        public string Manufacturer { get; set; }
        public string SerialNo { get; set; }
        public string Notes { get; set; }
        public bool Hospital { get; set; }
        public bool IsDeleted { get; set; }
        public bool Reminder { get; set; }
    }

    public class HealthChronologyReport
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public int TenantId { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Kind { get; set; }
        public string TableName { get; set; }
        public string Clinic { get; set; } // PCOs.LastName
        public string Practitioner { get; set; }
        public string Weight { get; set; }
        public string Results { get; set; }
        public string MicrochipNumber { get; set; }
        public string Notes { get; set; }
        public bool IsDeleted { get; set; }
        public bool Reminder { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string SoapPlan { get; set; }
        public bool Hospital { get; set; }
    }

    //public class HealthChronologyReport
    //{
    //    public int Id { get; set; }
    //    public DateTime ActionDate { get; set; }
    //    public string Kind { get; set; }
    //    public string TableName { get; set; }
    //    public string Clinic { get; set; } // PCOs.LastName
    //    public string Practitioner { get; set; }
    //    public string Weight { get; set; }
    //    public string Results { get; set; }
    //    public string MicrochipNumber { get; set; }
    //    public string Notes { get; set; }
    //}
}
