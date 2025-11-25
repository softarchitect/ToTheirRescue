using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Models.Response.DiaryResult;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.Response.MedResult;
using TYR.WEB.Models.ViewModels.AnimalProcedureViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class MedRepository : RepositoryBase<Med>, IMedRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public MedRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        public async Task<AddMedResponse> AddMedAsync(List<Med> meds)
        {
            try
            {
                var lstMeds = new List<Med>();
                foreach (var med in meds) 
                {
                    var vMed = await base.AddAsync(med);
                    await _dbContext.SaveChangesAsync();
                    lstMeds.Add(vMed);
                }

                return new AddMedResponse
                {
                    Data = new AddMedData { Meds = lstMeds },
                    Message = "Meds added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddMedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetMedResponse> GetMedByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstMeds = from m in _dbContext.Meds
                                          select new MedCustom
                                          {
                                              Id = m.Id,
                                              AdministeredBy = m.AdministeredBy,
                                              AdministeredDate = m.AdministeredDate ?? dtDate,
                                              AnimalId = m.AnimalId ?? 0,
                                              AnimalName = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                              AnimalType = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                              AnimalTypeId = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                              Dosage = m.Dosage,
                                              //Administered = m.Administered,
                                              Reminder = m.Reminder,
                                              Clinic = m.Clinic,
                                              DueDate = m.DueDate ?? dtDate,
                                              IsDeleted = m.IsDeleted,
                                              TenantId = m.TenantId ?? 0,
                                              MedicineId = m.MedicineId ?? 0,
                                              Medicine = m.MedicineId.HasValue ? _dbContext.Medicines.Where(me => me.Id.Equals(m.MedicineId.Value)).FirstOrDefault().MedicineName : string.Empty,
                                              Notes = m.Notes,
                                              PrescriptionRecordNo = m.PrescriptionRecordNo ?? 0,
                                              Veterinarian = m.Veterinarian
                                          };

                var lst = new List<MedCustom>();
                if(blnReminder)
                {
                    lst = await lstMeds
                            .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                }
                else
                {
                    lst = await lstMeds
                            .Where(a => a.AnimalId.Equals(animalId) && a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.AdministeredDate).ToListAsync().ConfigureAwait(false);
                }
               
                
                return new GetMedResponse
                {
                    Data = new GetMedData { Meds = lst },
                    Message = "Meds record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetMedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateMedResponse> UpdateMedAsync(Med med, int id)
        {
            DateTime? dtDate = null;
            try
            {
                var _med = await FindAsync(m => m.Id.Equals(id));

                _med.AnimalId = med.AnimalId != null && med.AnimalId.HasValue ? med.AnimalId.Value : _med.AnimalId;
                _med.PrescriptionRecordNo = med.PrescriptionRecordNo.HasValue ? med.PrescriptionRecordNo.Value : 0;
                _med.MedicineId = med.MedicineId ?? med.MedicineId;
                _med.AdministeredDate = med.AdministeredDate.HasValue ? med.AdministeredDate.Value : dtDate;
                _med.DueDate = med.DueDate ?? med.DueDate;
                _med.Dosage = med.Dosage;
                _med.Notes = med.Notes;
                _med.Reminder = med.Reminder;
                _med.AdministeredBy = med.AdministeredBy;
                _med.Clinic = med.Clinic;
                _med.Veterinarian = med.Veterinarian;
                _med.DateModified = DateTime.Now;
                _med.ModifiedBy = _userName;
                _med.IsDeleted = false;

                var entity = await base.UpdateAsync(_med);
                await _dbContext.SaveChangesAsync();

                return new UpdateMedResponse()
                {
                    Success = true,
                    Data = new UpdateMedData { Id = entity.Id, Med = entity },
                    Message = "Med updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateMedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteMedResponse> UpdateMedByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _med = await FindAsync(d => d.Id.Equals(id));
                if (_med != null)
                {
                    _med.IsDeleted = isDeleted;
                    _med.DateModified = DateTime.Now;
                    _med.ModifiedBy = _userName;

                    var med = await UpdateAsync(_med);
                    _dbContext.SaveChanges();
                    return new DeleteMedResponse
                    {
                        Data = new DeleteMedData
                        {
                            IsDeleted = med.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Med deleted sucessfully!"
                    };

                }
                else
                {
                    return new DeleteMedResponse
                    {
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Med not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteMedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateMedGivenListResponse> UpdateMedGivenListAsync(List<int> ids)
        {
            DateTime? dtDate = null;
            try
            {
                List<UpdateMedGivenData> lstMedsGivenData = new List<UpdateMedGivenData>();
                foreach (var id in ids) 
                {
                    var _med = await FindAsync(m => m.Id.Equals(id));
                    if(_med != null)
                    {
                        _med.AdministeredDate = DateTime.Now; // It will be Administered Date // med.AdministeredDate ?? med.AdministeredDate
                        _med.DueDate = dtDate; // It will be blank when Administered - Meds Given or Completed
                        _med.Reminder = false; // It will be False when Med Given or Completed. // med.Reminder
                        _med.DateModified = DateTime.Now;
                        _med.ModifiedBy = _userName;
                        _med.IsDeleted = false;

                        var entity = await base.UpdateAsync(_med);
                        await _dbContext.SaveChangesAsync();

                        lstMedsGivenData.Add(new UpdateMedGivenData { Id = id, Med = entity });
                    }
                }
                
                return new UpdateMedGivenListResponse()
                {
                    Success = true,
                    Data = new UpdateMedGivenListData { MedGivensData = lstMedsGivenData },
                    Message = "Med updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateMedGivenListResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateMedCompletedResponse> UpdateMedCompletedByIdAsync(int id)
        {
            try
            {
                var _med = await FindAsync(m => m.Id.Equals(id));
                
                //_med.AdministeredDate = DateTime.Now; // It will be Administered Date // med.AdministeredDate ?? med.AdministeredDate
                //_med.DueDate = dtDate; // It will be blank when Administered - Meds Given or Completed
                _med.Reminder = false; // It will be False when Med Given or Completed. // med.Reminder
                _med.DateModified = DateTime.Now;
                _med.ModifiedBy = _userName;
                _med.IsDeleted = false;

                var entity = await base.UpdateAsync(_med);
                await _dbContext.SaveChangesAsync();
                
                return new UpdateMedCompletedResponse()
                {
                    Success = true,
                    Data = new UpdateMedCompletedData { Id = id, Med = _med },
                    Message = "Med updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateMedCompletedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllMedResponse> GetMedByTenantIdAsync(bool isDeleted, bool blnReminder, int days, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstMeds = from m in _dbContext.Meds
                              select new MedCustom
                              {
                                  Id = m.Id,
                                  AdministeredBy = m.AdministeredBy,
                                  AdministeredDate = m.AdministeredDate ?? dtDate,
                                  AnimalId = m.AnimalId ?? 0,
                                  AnimalName = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalName : string.Empty,
                                  AnimalType = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalTypeName : string.Empty,
                                  AnimalTypeId = m.AnimalId.HasValue ? _dbContext.Animals.Where(a => a.Id.Equals(m.AnimalId.Value)).FirstOrDefault().AnimalTypeId : 0,
                                  Dosage = m.Dosage,
                                  Reminder = m.Reminder,
                                  Clinic = m.Clinic,
                                  DueDate = m.DueDate ?? dtDate,
                                  IsDeleted = m.IsDeleted,
                                  TenantId = m.TenantId ?? 0,
                                  MedicineId = m.MedicineId ?? 0,
                                  Medicine = m.MedicineId.HasValue ? _dbContext.Medicines.Where(me => me.Id.Equals(m.MedicineId.Value)).FirstOrDefault().MedicineName : string.Empty,
                                  Notes = m.Notes,
                                  PrescriptionRecordNo = m.PrescriptionRecordNo ?? 0,
                                  Veterinarian = m.Veterinarian
                              };

                var lst = new List<MedCustom>();
                if (blnReminder)
                {
                    var dtStartToday = DateTime.Today.Date;
                    var dtEndDate = DateTime.Now.AddDays(days).Date;
                    //var dtStartToday = DateTime.Today;
                    //var dtEndDate = DateTime.Now.AddDays(days);

                    if (days.Equals(-999)) // When -999 as days then need to return today's reminders only.
                    {
                        lst = await lstMeds
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId)
                                    && (a.DueDate.Value.Date == dtStartToday))
                                    //&& (a.DueDate.Value == dtStartToday))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                    }
                    else if (days.Equals(0))
                    {
                        lst = await lstMeds
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                    }
                    else
                    {
                        lst = await lstMeds
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId)
                                    //&& (a.DueDate.Value >= dtStartToday && a.DueDate.Value <= dtEndDate))
                                    && (a.DueDate.Value.Date >= dtStartToday && a.DueDate.Value.Date <= dtEndDate))
                            .OrderBy(a => a.DueDate).ToListAsync().ConfigureAwait(false);
                    }
                        
                }
                else
                {
                    lst = await lstMeds
                            .Where(a => a.Reminder.Equals(blnReminder) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.AdministeredDate).ToListAsync().ConfigureAwait(false);
                }


                return new GetAllMedResponse
                {
                    Data = new GetAllMedData { Count = lst.Count, Meds = lst },
                    Message = "Meds record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllMedResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting med record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
