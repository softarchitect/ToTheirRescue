using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalProcedureRepository : RepositoryBase<AnimalProcedure>, IAnimalProcedureRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        private readonly IAnimalRepository _animalRepository;
        private readonly IAnimalTypeRepository _animalTypeRepository;
        private readonly IHealthProcedureRepository _healthProcedureRepository;
        public AnimalProcedureRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor, 
                                        IAnimalRepository animalRepository, 
                                        IAnimalTypeRepository animalTypeRepository, 
                                        IHealthProcedureRepository healthProcedureRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
            _animalRepository = animalRepository;
            _animalTypeRepository = animalTypeRepository;
            _healthProcedureRepository = healthProcedureRepository;
        }

        public async Task<AddAnimalProcedureResponse> AddAnimalProcedureAsync(List<AnimalProcedure> animalProcedures)
        {
            try
            {
                var lstAnimalProcedures = new List<AnimalProcedure>();
                foreach (var animalProcedure in animalProcedures)
                {
                    var vAnimalProcedure = await base.AddAsync(animalProcedure);
                    await _dbContext.SaveChangesAsync();

                    // Let’s do this, if they enter Castration or Spaying/Neutering then let’s also turn Spay/Neutered to positive.
                    // Castration is the word used for horses.   But, anything else we just leave Spayed/Neutered as negative in the animal record.
                    // The user can go to animal details and change it manually if they want.
                    // So, if the procedure is Spaying/Neutering or Castration let’s change the Spayed/Neutered Boolean to true.
                    var vHealthProcedure = await _healthProcedureRepository.GetByIdAsync(animalProcedure.KindId.Value);
                    if(vHealthProcedure.Kind.Trim().Equals("Spaying/Neutering") ||
                        vHealthProcedure.Kind.Trim().Equals("Spaying") ||
                        vHealthProcedure.Kind.Trim().Equals("Neutering") ||
                        vHealthProcedure.Kind.Trim().Equals("Spay/Neutered") || 
                        vHealthProcedure.Kind.Trim().Equals("Spay") ||
                        vHealthProcedure.Kind.Trim().Equals("Neutered") ||
                        vHealthProcedure.Kind.Trim().Equals("Castration"))
                    {
                        var vAnimal = await _animalRepository.GetByIdAsync(animalProcedure.AnimalId.Value);
                        vAnimal.SpayedOrNeutered = true;

                        await _dbContext.SaveChangesAsync();
                    }

                    lstAnimalProcedures.Add(vAnimalProcedure);
                }

                return new AddAnimalProcedureResponse
                {
                    Data = new AddAnimalProcedureData { AnimalProcedures = lstAnimalProcedures },
                    Message = "Proc, Test, or Treatment added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding animal procedure record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalProcedureResponse> GetAnimalProcedureByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstAnimalProcedures = from ap in _dbContext.AnimalProcedures
                                          select new AnimalProcedureCustom
                                          {
                                              Id = ap.Id,
                                              ActionDate = ap.ActionDate.HasValue ? ap.ActionDate.Value : dtDate,
                                              Administerer = ap.Administerer,
                                              AnimalId = ap.AnimalId.HasValue ? ap.AnimalId.Value : 0,
                                              AnimalName = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                              AnimalType = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                              AnimalTypeId = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                              DateEntered = ap.DateEntered.HasValue ? ap.DateEntered.Value : dtDate,
                                              DueDate = ap.DueDate.HasValue ? ap.DueDate.Value : dtDate,
                                              HealthProcedureKind = ap.KindId.HasValue ? _dbContext.HealthProcedures.Where(hp => hp.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                              KindId = ap.KindId ?? 0,
                                              HospitalClinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId.Value)).FirstOrDefault().LastName : string.Empty,
                                              HospitalClinicId = ap.HospitalClinicId ?? 0,
                                              IsDeleted = ap.IsDeleted,
                                              MicrochipNumber = ap.MicrochipNumber,
                                              ModifiedBy = ap.ModifiedBy,
                                              Notes = ap.Notes,
                                              Reminder = ap.Reminder,
                                              Results = ap.Results,
                                              TenantId = ap.TenantId.HasValue ? ap.TenantId.Value : 0,
                                              Weight = ap.Weight
                                          };
                var lst = new List<AnimalProcedureCustom>();
                if(blnReminder)
                {
                    lst = await lstAnimalProcedures
                                .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstAnimalProcedures
                                .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.ActionDate).ToListAsync().ConfigureAwait(false);
                }
                return new GetAnimalProcedureResponse
                {
                    Data = new GetAnimalProcedureData { AnimalProcedures = lst },
                    Message = "Proc, Test, or Treatments record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal proc, test or treatments record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalWeightHistoryResponse> GetAnimalWeightHistoryByAnimalIdAsync(int animalId, int tenantId)
        {
            try
            {
                DateTime? dtAction = null;
                var lstWeightHistory = from ap in _dbContext.AnimalProcedures
                                             .Where(a => a.AnimalId.Equals(animalId) && a.TenantId.Equals(tenantId) && a.IsDeleted.Equals(false) && !string.IsNullOrEmpty(a.Weight))
                                             .OrderBy(a => a.Id)
                                             select new AnimalWeightHistory
                                             {
                                                 Id = ap.Id,
                                                 ActionDate = ap.ActionDate.HasValue ? ap.ActionDate.Value : dtAction,
                                                 AnimalId = ap.AnimalId.HasValue ? ap.AnimalId.Value : 0,
                                                 Weight = ap.Weight,
                                                 TenantId = ap.TenantId,
                                                 IsDeleted = ap.IsDeleted
                                             };
                                             
                var lstAnimalWeightHistory = await lstWeightHistory.ToListAsync().ConfigureAwait(false);
                return new GetAnimalWeightHistoryResponse
                {
                    Data = new GetAnimalWeightHistoryData { AnimalWeightHistory = lstAnimalWeightHistory },
                    Message = "Animal weight history retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalWeightHistoryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal weight history", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalProcedureResponse> UpdateAnimalProcedureAsync(AnimalProcedure animalProcedure, int id)
        {
            try
            {
                var _animalProcedure = await FindAsync(p => p.Id.Equals(id));
               
                _animalProcedure.AnimalId = animalProcedure.AnimalId != null && animalProcedure.AnimalId.HasValue ? animalProcedure.AnimalId.Value : _animalProcedure.AnimalId;
                _animalProcedure.KindId = animalProcedure.KindId ?? _animalProcedure.KindId;
                _animalProcedure.Reminder = animalProcedure.Reminder;
                _animalProcedure.DueDate = animalProcedure.DueDate ?? _animalProcedure.DueDate;
                _animalProcedure.ActionDate = animalProcedure.ActionDate ?? _animalProcedure.ActionDate;
                _animalProcedure.Weight = animalProcedure.Weight;
                //_animalProcedure.Clinic = animalProcedure.Clinic;
                _animalProcedure.HospitalClinicId = animalProcedure.HospitalClinicId ?? _animalProcedure.HospitalClinicId;
                _animalProcedure.Administerer = animalProcedure.Administerer;
                _animalProcedure.Results = animalProcedure.Results;
                _animalProcedure.MicrochipNumber = animalProcedure.MicrochipNumber;
                _animalProcedure.Notes = animalProcedure.Notes;
                _animalProcedure.IsDeleted = false;
                _animalProcedure.DateModified = DateTime.Now;
                _animalProcedure.ModifiedBy = animalProcedure.ModifiedBy;

                var entity = await base.UpdateAsync(_animalProcedure);
                await _dbContext.SaveChangesAsync();

                return new UpdateAnimalProcedureResponse()
                {
                    Success = true,
                    Data = new UpdateAnimalProcedureData { Id = entity.Id, AnimalProcedure = entity },
                    Message = "Proc, Test, or Treatment updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating animal proc, test, or treatment record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteAnimalProcedureResponse> UpdateAnimalProcedureByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _animalProcedure = await FindAsync(p => p.Id.Equals(id));
                if (_animalProcedure != null)
                {
                    _animalProcedure.IsDeleted = isDeleted;
                    _animalProcedure.DateModified = DateTime.Now;
                    _animalProcedure.ModifiedBy = _userName;

                    var animalProcedure = await UpdateAsync(_animalProcedure);
                    _dbContext.SaveChanges();
                    return new DeleteAnimalProcedureResponse
                    {
                        Data = new DeleteAnimalProcedureData
                        {
                            IsDeleted = animalProcedure.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Proc, Test, or Treatment deleted sucessfully!"
                    };

                }
                else
                {
                    return new DeleteAnimalProcedureResponse
                    {
                        Errors = new List<string> { "Id does not exist" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Proc, Test, or Treatment does not exists"
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteAnimalProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating animal proc, test, or treatment record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAnimalProcedureResponse> GetAllAnimalProceduresAsync(bool isDeleted, bool blnReminder, int days, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstAnimalProcedures = from ap in _dbContext.AnimalProcedures
                                          select new AnimalProcedureCustom
                                          {
                                              Id = ap.Id,
                                              ActionDate = ap.ActionDate.HasValue ? ap.ActionDate.Value : dtDate,
                                              Administerer = ap.Administerer,
                                              AnimalId = ap.AnimalId.HasValue ? ap.AnimalId.Value : 0,
                                              AnimalName = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                              AnimalType = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                              AnimalTypeId = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                              DateEntered = ap.DateEntered.HasValue ? ap.DateEntered.Value : dtDate,
                                              DueDate = ap.DueDate.HasValue ? ap.DueDate.Value : dtDate,
                                              HealthProcedureKind = ap.KindId.HasValue ? _dbContext.HealthProcedures.Where(hp => hp.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                              KindId = ap.KindId ?? 0,
                                              HospitalClinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId.Value)).FirstOrDefault().LastName : string.Empty,
                                              HospitalClinicId = ap.HospitalClinicId ?? 0,
                                              IsDeleted = ap.IsDeleted,
                                              MicrochipNumber = ap.MicrochipNumber,
                                              ModifiedBy = ap.ModifiedBy,
                                              Notes = ap.Notes,
                                              Reminder = ap.Reminder,
                                              Results = ap.Results,
                                              TenantId = ap.TenantId.HasValue ? ap.TenantId.Value : 0,
                                              Weight = ap.Weight
                                          };
                var lst = new List<AnimalProcedureCustom>();
                var dtStartToday = DateTime.Today;
                var dtEndDate = DateTime.Now.AddDays(days);

                if (days.Equals(0))
                {
                    lst = await lstAnimalProcedures
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstAnimalProcedures
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId)
                                    && (a.DueDate.Value >= dtStartToday && a.DueDate.Value <= dtEndDate))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                    
                
                return new GetAllAnimalProcedureResponse
                {
                    Data = new GetAllAnimalProcedureData { Count = lst.Count, AnimalProcedures = lst },
                    Message = "Proc, Test, or Treatments record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAnimalProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal proc, test or treatments record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
