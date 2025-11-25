using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.ReportResult;
using TYR.WEB.DataAccess;
using TYR.WEB.Models.Response.QueryResult;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Collections.Concurrent;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class ReportRepository : RepositoryBase<Animal>, IReportRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly ITenantRepository _tenantRepository;
        private readonly IAnimalMilestoneRepository _animalMilestoneRepository;
        private readonly IAnimalRepository _animalRepository;
        private readonly IPCORepository _pcoRepository;
        private readonly IAnimalVaccinationRepository _animalVaccinationRepository;
        private readonly IVaccinationTypeRepository _vaccinationTypeRepository;
        private readonly IAnimalProcedureRepository _animalProcedureRepository;
        private readonly IHealthProcedureRepository _healthProcedureRepository;
        private readonly IHealthNoteRepository _healthNoteRepository;
        private readonly ISOAPRepository _sOAPRepository;
        public ReportRepository(TYRDbContext dbContext, 
                                ITenantRepository tenantRepository,
                                IAnimalMilestoneRepository animalMilestoneRepository, 
                                IAnimalRepository animalRepository, 
                                IPCORepository pcoRepository,
                                IAnimalVaccinationRepository animalVaccinationRepository,
                                IVaccinationTypeRepository vaccinationTypeRepository,
                                IAnimalProcedureRepository animalProcedureRepository,
                                IHealthProcedureRepository healthProcedureRepository,
                                IHealthNoteRepository healthNoteRepository,
                                ISOAPRepository sOAPRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _tenantRepository = tenantRepository;
            _animalMilestoneRepository = animalMilestoneRepository;
            _animalRepository = animalRepository;
            _pcoRepository = pcoRepository;
            _animalVaccinationRepository = animalVaccinationRepository;
            _vaccinationTypeRepository = vaccinationTypeRepository;
            _animalProcedureRepository = animalProcedureRepository;
            _healthProcedureRepository = healthProcedureRepository;
            _healthNoteRepository = healthNoteRepository;
            _sOAPRepository = sOAPRepository;
        }
        public async Task<GetAnimalHealthReportResponse> GetAnimalHealthReportAsync(int animalId, int tenantId)
        {
            try
            {
                var tenantReport = await (from t in _dbContext.Tenants
                                          select new TenantReport
                                          {
                                              Id = t.ID,
                                              City = t.City,
                                              Name = t.Name,
                                              Phone = t.Phone,
                                              State = t.State,
                                              Street = t.Street,
                                              Zip = t.Zip
                                          }).Where(t => t.Id.Equals(tenantId)).FirstOrDefaultAsync().ConfigureAwait(false);

                var animalReport = await (from a in _dbContext.Animals
                                          join am in _dbContext.AnimalMilestones on a.Id equals am.AnimalId
                                          select new AnimalReport
                                          {
                                              Id = a.Id,
                                              TenantId = tenantId,
                                              AnimalId = a.AnimalId,
                                              AnimalMilestoneId = am.Id,
                                              AnimalName = a.AnimalName,
                                              AnimalTypeName = a.AnimalTypeName,
                                              Sex = a.Sex,
                                              Breed = a.Breed,
                                              Color = a.Color,
                                              BirthDate = am.MilestoneDate ?? DateTime.MinValue,
                                              IsApproxDOB = am.IsApproxDOB,
                                              IsDeleted = a.IsDeleted,
                                              MilestoneType = am.MilestoneType

                                          }).Where(an => an.Id.Equals(animalId) && an.IsDeleted.Equals(false) && an.MilestoneType.Trim().ToLower().Equals("birth") && an.TenantId.Equals(tenantId)).FirstOrDefaultAsync().ConfigureAwait(false);

                var chronicConditionReport = await (from a in _dbContext.Animals
                                                    select new ChronicConditonReport
                                                    {
                                                        Id = a.Id,
                                                        TenantId = tenantId,
                                                        ChronicCondition = !string.IsNullOrEmpty(a.ChronicCondition) ? a.ChronicCondition : "None",
                                                        IsDeleted = a.IsDeleted
                                                    }).Where(a => a.Id.Equals(animalId) && a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId)).FirstOrDefaultAsync();//.ConfigureAwait(false);
                var dietReport = await (from a in _dbContext.Animals
                                        select new DietReport
                                        {
                                            Id = a.Id,
                                            TenantId = tenantId,
                                            Diet = a.Diet,
                                            IsDeleted = a.IsDeleted
                                        }).Where(a => a.Id.Equals(animalId) && a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId)).FirstOrDefaultAsync(); //.ConfigureAwait(false);
                
                var reminderReports = new List<ReminderReport>();
                var vaccinationReminders = await (from av in _dbContext.AnimalVaccinations
                                                join a in _dbContext.Animals on av.AnimalId equals a.Id
                                                join vt in _dbContext.VaccinationTypes on av.KindId equals vt.Id
                                                select new ReminderReport
                                                {
                                                    AnimalId = a.Id,
                                                    DueDate = av.DueDate ?? DateTime.MinValue,
                                                    ReminderId = av.Id,
                                                    Kind = vt.Kind,
                                                    Reminder = av.Reminder,
                                                    TenantId = tenantId,
                                                    IsDeleted = av.IsDeleted
                                                })
                                                .Where(vr => vr.Reminder.Equals(true) && vr.IsDeleted.Equals(false) && vr.TenantId.Equals(tenantId) && vr.AnimalId.Equals(animalId)).OrderBy(vr => vr.DueDate)
                                                .ToListAsync().ConfigureAwait(false);
                reminderReports.AddRange(vaccinationReminders);

                var procedureReminders = await (from ap in _dbContext.AnimalProcedures
                                                join a in _dbContext.Animals on ap.AnimalId equals a.Id
                                                join hp in _dbContext.HealthProcedures on ap.KindId equals hp.Id
                                                select new ReminderReport
                                                {
                                                    AnimalId = a.Id,
                                                    DueDate = ap.DueDate ?? DateTime.MinValue,
                                                    ReminderId = ap.Id,
                                                    Kind = hp.Kind,
                                                    Reminder = ap.Reminder,
                                                    TenantId = tenantId,
                                                    IsDeleted = ap.IsDeleted
                                                }).Where(pr => pr.Reminder.Equals(true) && pr.IsDeleted.Equals(false) && pr.TenantId.Equals(tenantId) && pr.AnimalId.Equals(animalId)).OrderBy (pr => pr.DueDate)
                                                .ToListAsync().ConfigureAwait(false);
                reminderReports.AddRange(procedureReminders);

                //var vaccinationReports = new List<VaccinationReport>();
                //Kind obtained by using AnimalVaccinations.KindID = VaccinaionTypes.Kind
                //Date = AnimalVaccinations.ActionDate
                //Clinic by selecting the LastName from a join of the PCOs.ID = AnimalVaccinations.HospitalClinicID
                //Could also put PCOs.Hospital = True for an extra added safety criteria.

                //The Practitioner on the report is the AnimalVaccinations.Administerer
                //The Mfg is the AnimalVaccinations.VaccineManufacturer
                //The SN is the AnimalVaccinations.VaccineSerialNo


                //var vaccinationReports = await (from av in _dbContext.AnimalVaccinations
                //                          join a in _dbContext.Animals on av.AnimalId equals a.Id
                //                          join vt in _dbContext.VaccinationTypes on av.KindId equals vt.Id
                //                          join p in _dbContext.PCOs on av.HospitalClinicId equals p.Id
                //                          select new VaccinationReport
                //                          {
                //                              VaccinationId = av.Id,
                //                              AnimalId = a.Id,
                //                              TenantId = tenantId,
                //                              VaccinationKind = vt.Kind,
                //                              ActionDate = av.ActionDate,
                //                              Clinic = p.Hospital ? p.LastName : string.Empty,
                //                              Practitioner = av.Administerer,
                //                              TagNumber = av.TagNumber,
                //                              Manufacturer = av.VaccineManufacturer,
                //                              SerialNo = av.VaccineSerialNo,
                //                              Notes = av.Notes,
                //                              IsDeleted = av.IsDeleted,
                //                              Reminder = av.Reminder,
                //                              Hospital = p.Hospital
                //                          }).Where(vr => vr.IsDeleted.Equals(false) && vr.Reminder.Equals(false) && vr.Hospital.Equals(true) && vr.TenantId.Equals(tenantId) && vr.AnimalId.Equals(animalId)).OrderBy(vr => vr.ActionDate)
                //                          .ToListAsync().ConfigureAwait(false);

                var vaccinationReports = await _dbContext.AnimalVaccinations
                                                .Join(_dbContext.Animals, av => av.AnimalId, a => a.Id, (av, a) => new { av, a })
                                                .Join(_dbContext.VaccinationTypes, temp => temp.av.KindId, vt => vt.Id, (temp, vt) => new { temp.av, temp.a, vt })
                                                .Join(_dbContext.PCOs, temp => temp.av.HospitalClinicId, p => p.Id, (temp, p) => new VaccinationReport
                                                {
                                                    VaccinationId = temp.av.Id,
                                                    AnimalId = temp.a.Id,
                                                    TenantId = tenantId,
                                                    VaccinationKind = temp.vt.Kind,
                                                    ActionDate = temp.av.ActionDate,
                                                    Clinic = p.Hospital ? p.LastName : string.Empty,
                                                    Practitioner = temp.av.Administerer,
                                                    TagNumber = temp.av.TagNumber,
                                                    Manufacturer = temp.av.VaccineManufacturer,
                                                    SerialNo = temp.av.VaccineSerialNo,
                                                    Notes = temp.av.Notes,
                                                    IsDeleted = temp.av.IsDeleted,
                                                    Reminder = temp.av.Reminder,
                                                    Hospital = p.Hospital
                                                })
                                                .Where(vr => !vr.IsDeleted && !vr.Reminder && vr.Hospital && vr.TenantId == tenantId && vr.AnimalId == animalId)
                                                .OrderBy(vr => vr.ActionDate)
                                                .ToListAsync()
                                                .ConfigureAwait(false);


                //vaccinationReports.AddRange(vaccinations);

                var healthChronologyReports = new List<HealthChronologyReport>();

                // AnimalPrcoedures Collection
                //var animalProcedures = await (from ap in _dbContext.AnimalProcedures
                //                              join a in _dbContext.Animals on ap.AnimalId equals a.Id
                //                              join hp in _dbContext.HealthProcedures on ap.KindId equals hp.Id
                //                              join p in _dbContext.PCOs on ap.HospitalClinicId equals p.Id
                //                              select new HealthChronologyReport
                //                              {
                //                                  Id = ap.Id,
                //                                  AnimalId = a.Id,
                //                                  TenantId = tenantId,
                //                                  ActionDate = ap.ActionDate.HasValue ? ap.ActionDate.Value : DateTime.MinValue,
                //                                  Kind = hp.Kind,
                //                                  TableName = "Animal Procedure",
                //                                  Clinic = p.Hospital ? p.LastName: string.Empty,
                //                                  Practitioner = ap.Administerer,
                //                                  Weight = ap.Weight,
                //                                  Results = ap.Results,
                //                                  MicrochipNumber = ap.MicrochipNumber,
                //                                  Notes = ap.Notes,
                //                                  IsDeleted = ap.IsDeleted,
                //                                  Reminder = ap.Reminder,
                //                                  Assessment = string.Empty,
                //                                  Objective = string.Empty,
                //                                  SoapPlan = string.Empty,
                //                                  Subjective = string.Empty,
                //                                  Hospital = p.Hospital
                //                              }).Where(hcr => hcr.IsDeleted.Equals(false) && hcr.Reminder.Equals(false) && hcr.TenantId.Equals(tenantId) && hcr.AnimalId.Equals(animalId)).OrderBy(hcr => hcr.ActionDate)
                //                              .ToListAsync().ConfigureAwait(false);

                var animalProcedures = await _dbContext.AnimalProcedures
                                                .Join(_dbContext.Animals, ap => ap.AnimalId, a => a.Id, (ap, a) => new { ap, a })
                                                .Join(_dbContext.HealthProcedures, temp => temp.ap.KindId, hp => hp.Id, (temp, hp) => new { temp.ap, temp.a, hp })
                                                .Join(_dbContext.PCOs, temp => temp.ap.HospitalClinicId, p => p.Id, (temp, p) => new HealthChronologyReport
                                                {
                                                    Id = temp.ap.Id,
                                                    AnimalId = temp.a.Id,
                                                    TenantId = tenantId,
                                                    ActionDate = temp.ap.ActionDate ?? DateTime.MinValue, // Simplified null check
                                                    Kind = temp.hp.Kind,
                                                    TableName = "Animal Procedure",
                                                    Clinic = p.Hospital ? p.LastName : string.Empty,
                                                    Practitioner = temp.ap.Administerer,
                                                    Weight = temp.ap.Weight,
                                                    Results = temp.ap.Results,
                                                    MicrochipNumber = temp.ap.MicrochipNumber,
                                                    Notes = temp.ap.Notes,
                                                    IsDeleted = temp.ap.IsDeleted,
                                                    Reminder = temp.ap.Reminder,
                                                    Assessment = string.Empty,
                                                    Objective = string.Empty,
                                                    SoapPlan = string.Empty,
                                                    Subjective = string.Empty,
                                                    Hospital = p.Hospital
                                                })
                                                .Where(hcr => !hcr.IsDeleted && !hcr.Reminder && hcr.TenantId == tenantId && hcr.AnimalId == animalId)
                                                .OrderBy(hcr => hcr.ActionDate)
                                                .ToListAsync()
                                                .ConfigureAwait(false);


                // Add AnimalProcedures Collection into Health Chronology Reports
                healthChronologyReports.AddRange(animalProcedures);

                // HealthNotes Collection
                //var healthNotes = await (from hn in _dbContext.HealthNotes
                //                         join a in _dbContext.Animals on hn.AnimalId equals a.Id
                //                         select new HealthChronologyReport
                //                         {
                //                             Id = hn.Id,
                //                             AnimalId = a.Id,
                //                             TenantId = tenantId,
                //                             ActionDate = hn.ActionDate.HasValue ? hn.ActionDate.Value : DateTime.MinValue,
                //                             Kind = string.Empty,
                //                             TableName = "Health Note",
                //                             Clinic = string.Empty,
                //                             Practitioner = string.Empty,
                //                             Weight = string.Empty,
                //                             Results = string.Empty,
                //                             MicrochipNumber = string.Empty,
                //                             Notes = hn.Note,
                //                             IsDeleted = hn.IsDeleted,
                //                             Reminder = false,
                //                             Assessment = string.Empty,
                //                             Objective = string.Empty,
                //                             SoapPlan = string.Empty,
                //                             Subjective = string.Empty,
                //                             Hospital = false
                //                         }).Where(hcr => hcr.IsDeleted.Equals(false) && hcr.Reminder.Equals(false) && hcr.TenantId.Equals(tenantId) && hcr.AnimalId.Equals(animalId)).OrderBy(hcr => hcr.ActionDate)
                //                         .ToListAsync().ConfigureAwait(false);

                var healthNotes = await _dbContext.HealthNotes
                                        .Where(hn => !hn.IsDeleted && hn.AnimalId == animalId)
                                        .Join(_dbContext.Animals, hn => hn.AnimalId, a => a.Id, (hn, a) => new HealthChronologyReport
                                        {
                                            Id = hn.Id,
                                            AnimalId = a.Id,
                                            TenantId = tenantId,
                                            ActionDate = hn.ActionDate ?? DateTime.MinValue, // Simplified null check
                                            Kind = string.Empty,
                                            TableName = "Health Note",
                                            Clinic = string.Empty,
                                            Practitioner = string.Empty,
                                            Weight = string.Empty,
                                            Results = string.Empty,
                                            MicrochipNumber = string.Empty,
                                            Notes = hn.Note,
                                            IsDeleted = hn.IsDeleted,
                                            Reminder = false,
                                            Assessment = string.Empty,
                                            Objective = string.Empty,
                                            SoapPlan = string.Empty,
                                            Subjective = string.Empty,
                                            Hospital = false
                                        })
                                        .Where(hcr => hcr.TenantId == tenantId)
                                        .OrderBy(hcr => hcr.ActionDate)
                                        .ToListAsync()
                                        .ConfigureAwait(false);



                // Add HealthNotes collection into Health Chronology Reports
                healthChronologyReports.AddRange(healthNotes);

                // SOAPs Collection
                //var soaps = await (from s in _dbContext.SOAPs
                //                   join a in _dbContext.Animals on s.AnimalId equals a.Id
                //                   join p in _dbContext.PCOs on s.HospitalClinicId equals p.Id
                //                   select new HealthChronologyReport
                //                    {
                //                        Id = s.Id,
                //                        AnimalId = a.Id,
                //                        TenantId = tenantId,
                //                        ActionDate = s.ActionDate.HasValue ? s.ActionDate.Value : DateTime.MinValue,
                //                        Kind = string.Empty,
                //                        TableName = "SOAP",
                //                        Clinic = p.Hospital ? p.LastName: string.Empty,
                //                        Practitioner = s.Veterinarian,
                //                        Weight = string.Empty,
                //                        Results = string.Empty,
                //                        MicrochipNumber = string.Empty,
                //                        Notes = string.Empty,
                //                        IsDeleted = s.IsDeleted,
                //                        Reminder = false,
                //                        Assessment = s.Assessment,
                //                        Objective = s.Objective,
                //                        SoapPlan = s.SOAPPlan,
                //                        Subjective = s.Subjective,
                //                        Hospital = p.Hospital
                //                   }).Where(hcr => hcr.IsDeleted.Equals(false) && hcr.Reminder.Equals(false) && hcr.TenantId.Equals(tenantId) && hcr.AnimalId.Equals(animalId))
                //                    .OrderBy(hcr => hcr.ActionDate)
                //                    .ToListAsync().ConfigureAwait(false);

                var soaps = await _dbContext.SOAPs
                                    .Where(s => !s.IsDeleted && s.AnimalId == animalId) // Apply filters early
                                    .Join(_dbContext.Animals,
                                          s => s.AnimalId,
                                          a => a.Id,
                                          (s, a) => new { s, a })
                                    .Join(_dbContext.PCOs,
                                          sa => sa.s.HospitalClinicId,
                                          p => p.Id,
                                          (sa, p) => new HealthChronologyReport
                                          {
                                              Id = sa.s.Id,
                                              AnimalId = sa.a.Id,
                                              TenantId = tenantId,
                                              ActionDate = sa.s.ActionDate ?? DateTime.MinValue, // Use null-coalescing operator
                                              Kind = string.Empty,
                                              TableName = "SOAP",
                                              Clinic = p.Hospital ? p.LastName : string.Empty,
                                              Practitioner = sa.s.Veterinarian,
                                              Weight = string.Empty,
                                              Results = string.Empty,
                                              MicrochipNumber = string.Empty,
                                              Notes = string.Empty,
                                              IsDeleted = sa.s.IsDeleted,
                                              Reminder = false,
                                              Assessment = sa.s.Assessment,
                                              Objective = sa.s.Objective,
                                              SoapPlan = sa.s.SOAPPlan,
                                              Subjective = sa.s.Subjective,
                                              Hospital = p.Hospital
                                          })
                                    .Where(hcr => !hcr.IsDeleted && !hcr.Reminder && hcr.TenantId == tenantId)
                                    .OrderBy(hcr => hcr.ActionDate)
                                    .ToListAsync();


                // Add SOAPs collection into Health Chronology Reports
                healthChronologyReports.AddRange(soaps);

                //var vHealthChronologyReports = healthChronologyReports.OrderBy(hcr => hcr.ActionDate).ToList();

                return new GetAnimalHealthReportResponse
                {
                    Data = new GetAnimalHealthReportData
                    {
                        TenantReport = tenantReport,
                        AnimalReport = animalReport,
                        ChronicConditonReport = chronicConditionReport,
                        DietReport = dietReport,
                        ReminderReports = reminderReports,
                        VaccinationReports = vaccinationReports,
                        HealthChronologyReports = healthChronologyReports.OrderBy(hcr => hcr.ActionDate).ToList() // Directly sorting within the object initialization
                    },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal health report data has collected."
                };


            }
            catch (Exception ex)
            {
                return new GetAnimalHealthReportResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string>
                    {
                        "Oops! Error occurred for animal health report.",
                        ex.InnerException?.ToString() ?? ex.Message // Prevents potential NullReferenceException
                    }
                };

            }

        }

    }
}
