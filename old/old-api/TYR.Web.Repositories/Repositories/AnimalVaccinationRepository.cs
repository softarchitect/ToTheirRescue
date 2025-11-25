using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.DataAccess;
using Microsoft.AspNetCore.Http;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;
using Microsoft.EntityFrameworkCore;
using TYR.WEB.Models.ViewModels.AnimalBehaviorViewModel;
using TYR.WEB.Models.ViewModels.AnimalVaccinationViewModel;
using TYR.WEB.Models.ViewModels.TenantViewModel;
using Microsoft.VisualBasic;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalVaccinationRepository : RepositoryBase<AnimalVaccination>, IAnimalVaccinationRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public AnimalVaccinationRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }
        public async Task<AddAnimalVaccinationResponse> AddAnimalVaccinationAsync(List<AnimalVaccination> animalVaccinations)
        {
            try
            {
                var lstAnimalVaccinations = new List<AnimalVaccination>();
                foreach (var animalVaccination in animalVaccinations)
                {
                    var vAnimalVaccination = await base.AddAsync(animalVaccination);
                    await _dbContext.SaveChangesAsync();

                    lstAnimalVaccinations.Add(vAnimalVaccination);
                }

                return new AddAnimalVaccinationResponse
                {
                    Data = new AddAnimalVaccinationData { AnimalVaccinations = lstAnimalVaccinations },
                    Message = "Vaccination added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalVaccinationResponse> GetAnimalVaccinationByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstAnimalVaccinations = from ap in _dbContext.AnimalVaccinations
                                          select new AnimalVaccinationCustom
                                          {
                                              Id = ap.Id,
                                              ActionDate = ap.ActionDate ?? dtDate,
                                              Administerer = ap.Administerer,
                                              AnimalId = ap.AnimalId ?? 0,
                                              AnimalName = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                              AnimalType = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                              AnimalTypeId = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                              DateEntered = ap.DateEntered ?? dtDate,
                                              DueDate = ap.DueDate ?? dtDate,
                                              VaccinationKind = ap.KindId.HasValue ? _dbContext.VaccinationTypes.Where(vt => vt.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                              KindId = ap.KindId ?? 0,
                                              HospitalClinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId.Value)).FirstOrDefault().LastName : string.Empty,
                                              HospitalClinicId = ap.HospitalClinicId ?? 0,
                                              IsDeleted = ap.IsDeleted,
                                              TagNumber = ap.TagNumber,
                                              VaccineManufacturer = ap.VaccineManufacturer,
                                              VaccineSerialNo = ap.VaccineSerialNo,
                                              //VaccineExpirationDate = ap.VaccineExpirationDate ?? dtDate,
                                              ModifiedBy = ap.ModifiedBy,
                                              Notes = ap.Notes,
                                              DueAgain = ap.DueAgain,
                                              VaccRecordNo = ap.VaccRecordNo,
                                              Reminder = ap.Reminder,
                                              TenantId = ap.TenantId ?? 0 
                                          };
                var lst = new List<AnimalVaccinationCustom>();
                if(blnReminder)
                {
                    lst = await lstAnimalVaccinations
                                .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstAnimalVaccinations
                                .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.ActionDate).ToListAsync().ConfigureAwait(false);
                }

                return new GetAnimalVaccinationResponse
                {
                    Data = new GetAnimalVaccinationData { AnimalVaccinations = lst },
                    Message = "Vaccinations record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalVaccinationResponse> UpdateAnimalVaccinationAsync(AnimalVaccination animalVaccination, int id)
        {
            try
            {
                var _animalVaccination = await FindAsync(p => p.Id.Equals(id));

                _animalVaccination.AnimalId = animalVaccination.AnimalId != null && animalVaccination.AnimalId.HasValue ? animalVaccination.AnimalId.Value : _animalVaccination.AnimalId;
                _animalVaccination.KindId = animalVaccination.KindId ?? _animalVaccination.KindId;
                _animalVaccination.Reminder = animalVaccination.Reminder;
                _animalVaccination.DueDate = animalVaccination.DueDate ?? _animalVaccination.DueDate;
                _animalVaccination.ActionDate = animalVaccination.ActionDate ?? _animalVaccination.ActionDate;
                _animalVaccination.HospitalClinicId = animalVaccination.HospitalClinicId ?? _animalVaccination.HospitalClinicId;
                _animalVaccination.Administerer = string.IsNullOrEmpty(animalVaccination.Administerer) ? _animalVaccination.Administerer : animalVaccination.Administerer;
                _animalVaccination.Notes = string.IsNullOrEmpty(animalVaccination.Notes) ? _animalVaccination.Notes : animalVaccination.Notes;
                _animalVaccination.VaccineManufacturer = string.IsNullOrEmpty(animalVaccination.VaccineManufacturer) ? _animalVaccination.VaccineManufacturer : animalVaccination.VaccineManufacturer;
                //_animalVaccination.VaccineExpirationDate = animalVaccination.VaccineExpirationDate ?? _animalVaccination.VaccineExpirationDate;
                _animalVaccination.TagNumber = string.IsNullOrEmpty(animalVaccination.TagNumber) ? _animalVaccination.TagNumber : animalVaccination.TagNumber;
                _animalVaccination.VaccineSerialNo = string.IsNullOrEmpty(animalVaccination.VaccineSerialNo) ? _animalVaccination.VaccineSerialNo : animalVaccination.VaccineSerialNo;
                _animalVaccination.VaccRecordNo = string.IsNullOrEmpty(animalVaccination.VaccRecordNo) ? _animalVaccination.VaccRecordNo : animalVaccination.VaccRecordNo;
                _animalVaccination.DueAgain = string.IsNullOrEmpty(animalVaccination.DueAgain) ? _animalVaccination.DueAgain : animalVaccination.DueAgain;
                _animalVaccination.IsDeleted = false;
                _animalVaccination.DateModified = DateTime.Now;
                _animalVaccination.ModifiedBy = animalVaccination.ModifiedBy;

                var entity = await base.UpdateAsync(_animalVaccination);
                await _dbContext.SaveChangesAsync();

                // Update Reminder record based on VaccRecord and DueAgain record 
                var result = GetAnimalVaccinationByAnimalIdVaccRecordNoAsync(_animalVaccination.AnimalId.Value, _animalVaccination.VaccRecordNo, true, _animalVaccination.TenantId.Value);
                if(result.Result.Success)
                {
                    var vaccination = result.Result.Data.AnimalVaccinations.FirstOrDefault();
                    if(vaccination != null)
                    {
                        var _vaccination = await FindAsync(v => v.Id.Equals(vaccination.Id));
                        _vaccination.DueDate = animalVaccination.DueDate ?? _vaccination.DueDate;
                        //_vaccination.AnimalId = animalVaccination.AnimalId != null && animalVaccination.AnimalId.HasValue ? animalVaccination.AnimalId.Value : _vaccination.AnimalId;
                        _vaccination.KindId = animalVaccination.KindId ?? _vaccination.KindId;
                        //_vaccination.Reminder = animalVaccination.Reminder;
                        //_vaccination.ActionDate = animalVaccination.ActionDate ?? _vaccination.ActionDate;
                        //_vaccination.HospitalClinicId = animalVaccination.HospitalClinicId ?? _vaccination.HospitalClinicId;
                        //_vaccination.Administerer = string.IsNullOrEmpty(animalVaccination.Administerer) ? _vaccination.Administerer : animalVaccination.Administerer;
                        //_vaccination.Notes = string.IsNullOrEmpty(animalVaccination.Notes) ? _vaccination.Notes : animalVaccination.Notes;
                        //_vaccination.VaccineManufacturer = string.IsNullOrEmpty(animalVaccination.VaccineManufacturer) ? _vaccination.VaccineManufacturer : animalVaccination.VaccineManufacturer;
                        //_vaccination.VaccineExpirationDate = animalVaccination.VaccineExpirationDate ?? _vaccination.VaccineExpirationDate;
                        //_vaccination.TagNumber = string.IsNullOrEmpty(animalVaccination.TagNumber) ? _vaccination.TagNumber : animalVaccination.TagNumber;
                        //_vaccination.VaccineSerialNo = string.IsNullOrEmpty(animalVaccination.VaccineSerialNo) ? _vaccination.VaccineSerialNo : animalVaccination.VaccineSerialNo;
                        _vaccination.VaccRecordNo = string.IsNullOrEmpty(animalVaccination.VaccRecordNo) ? _vaccination.VaccRecordNo : animalVaccination.VaccRecordNo;
                        _vaccination.DueAgain = string.IsNullOrEmpty(animalVaccination.DueAgain) ? _vaccination.DueAgain : animalVaccination.DueAgain;
                        _vaccination.IsDeleted = false;
                        _vaccination.DateModified = DateTime.Now;
                        _vaccination.ModifiedBy = animalVaccination.ModifiedBy;

                        var entityVaccination = await base.UpdateAsync(_vaccination);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                return new UpdateAnimalVaccinationResponse()
                {
                    Success = true,
                    Data = new UpdateAnimalVaccinationData { Id = entity.Id, AnimalVaccination = entity },
                    Message = "Vaccination updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteAnimalVaccinationResponse> UpdateAnimalVaccinationByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _animalVaccination = await FindAsync(p => p.Id.Equals(id));
                if (_animalVaccination != null)
                {
                    var vAnimalVaccinations = _dbContext.AnimalVaccinations
                                                .Where(v => v.KindId.Equals(_animalVaccination.KindId) && v.AnimalId.Equals(_animalVaccination.AnimalId)
                                                        && v.TenantId.Equals(_animalVaccination.TenantId.Value) && v.IsDeleted.Equals(false) && v.ActionDate.HasValue.Equals(true))
                                                .OrderByDescending(a => a.ActionDate)
                                                .ToList();//.ConfigureAwait(false);
                                                //.FirstOrDefault();
                    //.OrderBy(a => a.Id).FirstOrDefault();

                    _animalVaccination.IsDeleted = isDeleted;
                    _animalVaccination.DateModified = DateTime.Now;
                    _animalVaccination.ModifiedBy = _userName;

                    var animalVaccination = await UpdateAsync(_animalVaccination);
                    _dbContext.SaveChanges();

                    int animalVaccinationId = 0;
                    foreach(var v in vAnimalVaccinations)
                    {
                        if(v.Id.Equals(id))
                        {
                            animalVaccinationId = v.Id;
                        }
                    }

                    //if (id.Equals(vAnimalVaccination.Id)) // Check for main vaccination record if equal then continue delete all reminders otherwise no deletion of reminders
                    if (animalVaccinationId > 0) // Check for main vaccination record if equal then continue delete all reminders otherwise no deletion of reminders
                    {
                        // If the user deletes a vaccination then we need to also delete the reminder that was created by the vaccination. 
                        //var result = await GetAnimalVaccinationsByVaccRecordNoAsync(_animalVaccination.VaccRecordNo, _animalVaccination.TenantId.Value);
                        var result = await GetAnimalVaccinationsByVaccRecordNoAsync(_animalVaccination.AnimalId.Value, _animalVaccination.KindId.Value, _animalVaccination.TenantId.Value, _animalVaccination.VaccRecordNo);
                        if (result.Success)
                        {
                            foreach (var vacc in result.Data.AnimalVaccinations)
                            {
                                vacc.IsDeleted = isDeleted;
                                vacc.DateModified = DateTime.Now;
                                vacc.ModifiedBy = _userName;

                                var vaccination = await UpdateAsync(vacc);
                                _dbContext.SaveChanges();
                            }
                        }
                    }

                    return new DeleteAnimalVaccinationResponse
                    {
                        Data = new DeleteAnimalVaccinationData
                        {
                            IsDeleted = animalVaccination.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Vaccination deleted sucessfully!"
                    };
                }
                else
                {
                    return new DeleteAnimalVaccinationResponse
                    {
                        Errors = new List<string> { "Identifier does not exist" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Vaccination does not exist"
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteAnimalVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetVaccinationResponse> GetAnimalVaccinationByAnimalIdVaccRecordNoAsync(int animalId, string vaccRecordNo, bool blnReminder, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstAnimalVaccinations = from ap in _dbContext.AnimalVaccinations
                                            select new AnimalVaccination
                                            {
                                                Id = ap.Id,
                                                ActionDate = ap.ActionDate ?? dtDate,
                                                Administerer = ap.Administerer,
                                                AnimalId = ap.AnimalId ?? 0,
                                                DateEntered = ap.DateEntered ?? dtDate,
                                                DueDate = ap.DueDate ?? dtDate,
                                                //VaccinationKind = ap.KindId.HasValue ? _dbContext.VaccinationTypes.Where(vt => vt.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                                KindId = ap.KindId ?? 0,
                                                //HospitalClinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId.Value)).FirstOrDefault().LastName : string.Empty,
                                                HospitalClinicId = ap.HospitalClinicId ?? 0,
                                                IsDeleted = ap.IsDeleted,
                                                TagNumber = ap.TagNumber,
                                                VaccineManufacturer = ap.VaccineManufacturer,
                                                VaccineSerialNo = ap.VaccineSerialNo,
                                                //VaccineExpirationDate = ap.VaccineExpirationDate ?? dtDate,
                                                ModifiedBy = ap.ModifiedBy,
                                                Notes = ap.Notes,
                                                DueAgain = ap.DueAgain,
                                                VaccRecordNo = ap.VaccRecordNo,
                                                Reminder = ap.Reminder,
                                                TenantId = ap.TenantId ?? 0
                                            };
                var lst = new List<AnimalVaccination>();
                if(blnReminder)
                {
                    lst = await lstAnimalVaccinations
                                .Where(a => a.AnimalId.Equals(animalId) && a.VaccRecordNo.ToLower().Trim().Equals(vaccRecordNo.ToLower().Trim()) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstAnimalVaccinations
                                .Where(a => a.AnimalId.Equals(animalId) && a.VaccRecordNo.ToLower().Trim().Equals(vaccRecordNo.ToLower().Trim()) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId))
                                .OrderBy(a => a.ActionDate).ToListAsync().ConfigureAwait(false);
                }
                
                return new GetVaccinationResponse
                {
                    Data = new GetVaccinationData { AnimalVaccinations = lst },
                    Message = "Vaccinations record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        
        public async Task<GetVaccinationResponse> GetAnimalVaccinationsByVaccRecordNoAsync(int animalId, int kindId, int tenantId, string vaccRecordNo)
        {
            try
            {
                var lstAnimalVaccination = await _dbContext.AnimalVaccinations
                                                .Where(v => v.AnimalId.Equals(animalId) && v.KindId.Equals(kindId) && v.TenantId.Equals(tenantId) && v.IsDeleted.Equals(false) && v.VaccRecordNo.Equals(vaccRecordNo))
                                                .OrderBy(a => a.Id)
                                                .ToListAsync().ConfigureAwait(false);
                return new GetVaccinationResponse
                {
                    Data = new GetVaccinationData { AnimalVaccinations = lstAnimalVaccination },
                    Message = "Vaccinations record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAnimalVaccinationResponse> GetAllAnimalVaccinationsAsync(bool isDeleted, bool blnReminder, int days, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstAnimalVaccinations = from ap in _dbContext.AnimalVaccinations
                                            select new AnimalVaccinationCustom
                                            {
                                                Id = ap.Id,
                                                ActionDate = ap.ActionDate ?? dtDate,
                                                Administerer = ap.Administerer,
                                                AnimalId = ap.AnimalId ?? 0,
                                                AnimalName = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                                AnimalType = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                                AnimalTypeId = ap.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(ap.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                                DateEntered = ap.DateEntered ?? dtDate,
                                                DueDate = ap.DueDate ?? dtDate,
                                                VaccinationKind = ap.KindId.HasValue ? _dbContext.VaccinationTypes.Where(vt => vt.Id.Equals(ap.KindId)).FirstOrDefault().Kind : string.Empty,
                                                KindId = ap.KindId ?? 0,
                                                HospitalClinic = ap.HospitalClinicId.HasValue ? _dbContext.PCOs.Where(p => p.Id.Equals(ap.HospitalClinicId.Value)).FirstOrDefault().LastName : string.Empty,
                                                HospitalClinicId = ap.HospitalClinicId ?? 0,
                                                IsDeleted = ap.IsDeleted,
                                                TagNumber = ap.TagNumber,
                                                VaccineManufacturer = ap.VaccineManufacturer,
                                                VaccineSerialNo = ap.VaccineSerialNo,
                                                //VaccineExpirationDate = ap.VaccineExpirationDate ?? dtDate,
                                                ModifiedBy = ap.ModifiedBy,
                                                Notes = ap.Notes,
                                                DueAgain = ap.DueAgain,
                                                VaccRecordNo = ap.VaccRecordNo,
                                                Reminder = ap.Reminder,
                                                TenantId = ap.TenantId ?? 0
                                            };
                var lst = new List<AnimalVaccinationCustom>();
                var dtStartToday = DateTime.Today;
                var dtEndDate = DateTime.Now.AddDays(days);
                
                if(days.Equals(0))
                {
                    lst = await lstAnimalVaccinations
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstAnimalVaccinations
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId) 
                                    && (a.DueDate.Value >= dtStartToday && a.DueDate.Value <= dtEndDate))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                
                

                return new GetAllAnimalVaccinationResponse
                {
                    Data = new GetAllAnimalVaccinationData { Count = lst.Count, AnimalVaccinations = lst },
                    Message = "Vaccinations record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAnimalVaccinationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting vaccination record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<CheckAnimalVaccinationReminderResponse> CheckAnimalVaccinationRemindersExistAsync(int id)
        {
            try
            {
                var _animalVaccination = await FindAsync(p => p.Id.Equals(id));
                if (_animalVaccination != null)
                {
                    var vAnimalVaccination = _dbContext.AnimalVaccinations
                                                .Where(v => v.AnimalId.Equals(_animalVaccination.AnimalId) && v.KindId.Equals(_animalVaccination.KindId) && v.IsDeleted.Equals(false)
                                                    && v.TenantId.Equals(_animalVaccination.TenantId.Value))
                                                .OrderBy(a => a.Id).FirstOrDefault();

                    if (id.Equals(vAnimalVaccination.Id)) // Check for main vaccination record if equal then continue to check reminders exists or not
                    {
                        // If the user deletes a vaccination then we need to also delete the reminder that was created by the vaccination. 
                        //var result = await GetAnimalVaccinationsByVaccRecordNoAsync(_animalVaccination.VaccRecordNo, _animalVaccination.TenantId.Value);
                        var result = await GetAnimalVaccinationsByVaccRecordNoAsync(_animalVaccination.AnimalId.Value, _animalVaccination.KindId.Value, _animalVaccination.TenantId.Value, _animalVaccination.VaccRecordNo);
                        if (result.Success && result?.Data?.AnimalVaccinations?.Count > 0)
                        {
                            return new CheckAnimalVaccinationReminderResponse
                            { 
                                Data = new CheckAnimalVaccinationReminderData { IsReminderExist = true },
                                Message = "Vaccination reminder(s) exist",
                                StatusCode = 200,
                                Success = true
                            };
                        }
                    }

                    return new CheckAnimalVaccinationReminderResponse
                    {
                        Data = new CheckAnimalVaccinationReminderData { IsReminderExist = false },
                        Message = "No Vaccination reminder(s)",
                        StatusCode = 200,
                        Success = true
                    };
                }
                else
                {
                    return new CheckAnimalVaccinationReminderResponse
                    {
                        Data = new CheckAnimalVaccinationReminderData { IsReminderExist = false },
                        Message = "Vaccination record does not exist",
                        StatusCode = 200,
                        Success = true
                    };
                }
            }
            catch (Exception ex)
            {
                return new CheckAnimalVaccinationReminderResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking vaccination reminder", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
