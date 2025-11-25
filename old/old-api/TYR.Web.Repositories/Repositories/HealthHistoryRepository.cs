using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using TYR.WEB.Models.Response.HealthHisotryResult;
using Microsoft.EntityFrameworkCore;
using TYR.WEB.DataAccess.Entities;

namespace TYR.Web.Repositories.Repositories
{
    public class HealthHistoryRepository : RepositoryBase<HealthNote>, IHealthHistoryRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly IHealthNoteRepository _healthNoteRepository;
        private readonly IAnimalVaccinationRepository _animalVaccinationRepository;
        private readonly IAnimalProcedureRepository _animalProcedureRepository;
        public HealthHistoryRepository(TYRDbContext dbContext, IHealthNoteRepository healthNoteRepository, IAnimalVaccinationRepository animalVaccinationRepository, IAnimalProcedureRepository animalProcedureRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _healthNoteRepository = healthNoteRepository;
            _animalVaccinationRepository = animalVaccinationRepository;
            _animalProcedureRepository = animalProcedureRepository;
        }

        public async Task<GetHealthHistoryResponse> GetHealthHistoryByAnimalIdAsync(int animalId, int tenantId)
        {
            try
            {
                var lstHealthHisotry = new List<HealthHistory>();
                
                // Animal Vaccination Health History list
                var lstAnimalVaccination = await (from av in _dbContext.AnimalVaccinations.Where(av => av.AnimalId.Equals(animalId) && av.IsDeleted.Equals(false) && av.TenantId.Equals(tenantId) && av.Reminder.Equals(false))
                                                  select new HealthHistory
                                                    {
                                                        ActionDate = av.ActionDate,
                                                        AnimalId = av.AnimalId,
                                                        Clinic =  av.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(av.HospitalClinicId) && p.Hospital.Equals(true)).FirstOrDefault().LastName : string.Empty,
                                                        IsDeleted = av.IsDeleted,
                                                        Kind = av.KindId.HasValue ? _dbContext.VaccinationTypes.Where(v => v.Id.Equals(av.KindId)).FirstOrDefault().Kind : string.Empty,
                                                        Notes = av.Notes,
                                                        TenantId = av.TenantId,
                                                        Type = "Vaccination"
                                                    })
                                                    .ToListAsync().ConfigureAwait(false);
                //.OrderBy(av => av.ActionDate).ToListAsync().ConfigureAwait(false);
                lstHealthHisotry.AddRange(lstAnimalVaccination);
                // Animal Procedure Health History list
                var lstAnimalProcedure = await (from ap in _dbContext.AnimalProcedures.Where(ap => ap.AnimalId.Equals(animalId) && ap.IsDeleted.Equals(false) && ap.TenantId.Equals(tenantId) && ap.Reminder.Equals(false))
                                                select new HealthHistory
                                                {
                                                    ActionDate = ap.ActionDate,
                                                    AnimalId = ap.AnimalId,
                                                    Clinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId) && p.EntityType.Equals("CorO") && p.Hospital.Equals(true)).FirstOrDefault().LastName : string.Empty,
                                                    IsDeleted = ap.IsDeleted,
                                                    Kind = ap.KindId.HasValue ? _dbContext.HealthProcedures.Where(v => v.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                                    Notes = ap.Notes,
                                                    TenantId = ap.TenantId,
                                                    Type = "Procedure"
                                                })
                                                .ToListAsync().ConfigureAwait(false);
                //.OrderBy(ap => ap.ActionDate).ToListAsync().ConfigureAwait(false);
                lstHealthHisotry.AddRange(lstAnimalProcedure);
                // Health Note's Health History list
                var lstHealthNote = await (from hn in _dbContext.HealthNotes.Where(hn => hn.AnimalId.Equals(animalId) && hn.IsDeleted.Equals(false) && hn.TenantId.Equals(tenantId))
                                           select new HealthHistory
                                            {
                                                ActionDate = hn.ActionDate,
                                                AnimalId = hn.AnimalId,
                                                Clinic = string.Empty,
                                                IsDeleted = hn.IsDeleted,
                                                Kind = string.Empty,
                                                Notes = hn.Note,
                                                TenantId = hn.TenantId,
                                                Type = "Health Note"
                                            })
                                            .ToListAsync().ConfigureAwait(false);
                //.OrderBy(hn => hn.ActionDate).ToListAsync().ConfigureAwait(false);
                lstHealthHisotry.AddRange(lstHealthNote);
                //// Meds Health History List  -- It should Prescriptions instead of Meds - Once Prescriptions will be implemented then needs to implement for prescriptions History here
                //var lstMedPrescription = await (from m in _dbContext.Meds.Where(m => m.AnimalId.Equals(animalId) && m.IsDeleted.Equals(false) && m.TenantId.Equals(tenantId))
                //                                select new HealthHistory
                //                                {
                //                                    ActionDate = m.AdministeredDate,
                //                                    AnimalId = m.AnimalId,
                //                                    Clinic = string.Empty,
                //                                    IsDeleted = m.IsDeleted,
                //                                    Kind = string.Empty,
                //                                    Notes = m.Notes,
                //                                    TenantId = m.TenantId,
                //                                    Type = "Med prescription"
                //                                })
                //                                .OrderBy(m => m.ActionDate).ToListAsync().ConfigureAwait(false);
                //lstHealthHisotry.AddRange(lstMedPrescription);
                // SOAP Health History List
                var lstSoap = await (from s in _dbContext.SOAPs.Where(s => s.AnimalId.Equals(animalId) && s.IsDeleted.Equals(false) && s.TenantId.Equals(tenantId))
                                     select new HealthHistory
                                     {
                                         ActionDate = s.ActionDate,
                                         AnimalId = s.AnimalId,
                                         Clinic = s.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(s.HospitalClinicId) && p.EntityType.Equals("CorO") && p.Hospital.Equals(true)).FirstOrDefault().LastName : string.Empty,
                                         IsDeleted = s.IsDeleted,
                                         Kind = string.Empty,
                                         Notes = s.SOAPPlan,
                                         TenantId = s.TenantId,
                                         Type = "SOAP"
                                     })
                                     .ToListAsync().ConfigureAwait(false);
                //.OrderBy(s => s.ActionDate).ToListAsync().ConfigureAwait(false);
                lstHealthHisotry.AddRange(lstSoap);
                var healthHisotryList = lstHealthHisotry.OrderBy(hh => hh.ActionDate).ToList();

                return new GetHealthHistoryResponse
                {
                    Data = new GetHealthHistoryData { HealthHistories = healthHisotryList },
                    Success = true,
                    StatusCode = 200,
                    Message = "Health history retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetHealthHistoryResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while getting PCO history",
                                    ex.InnerException?.ToString() ?? ex.Message
                                }
                };
            }
        }
    }
}
