using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.DiaryResult;


namespace TYR.Web.Repositories.Repositories
{
    public class DiaryRepository : RepositoryBase<Diary>, IDiaryRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public DiaryRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor): base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }
        public async Task<AddDiaryResponse> AddDiaryAsync(Diary diary)
        {
            try
            {
                if (diary != null) diary.Animal = diary.AnimalId != null && diary.AnimalId.HasValue && diary.AnimalId.Value > 0 ? _dbContext.Animals.Where(a => a.Id.Equals(diary.AnimalId)).FirstOrDefault().AnimalName : string.Empty;
                var vDiary = await base.AddAsync(diary);
                await _dbContext.SaveChangesAsync();

                return new AddDiaryResponse
                {
                    Data = new AddDiaryData { Id = vDiary.Id, Diary = vDiary },
                    Message = "Diary entry added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddDiaryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding diary entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetDiaryResponse> GetDiaryByTenantIdAsync(string entityType, bool isDeleted, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstDiaries = from d in _dbContext.Diary
                                 select new DiaryCustom
                                 {
                                     Id = d.Id,
                                     AnimalId = d.AnimalId ?? 0,
                                     TenantOrAnimal = d.TenantOrAnimal,
                                     ActionDate = d.ActionDate ?? dtDate,
                                     Notes = d.Notes,
                                     IsDeleted = d.IsDeleted,
                                     TenantId = d.TenantId ?? 0
                                 };
                var lst = await lstDiaries
                            .Where(a => a.TenantOrAnimal.ToLower().Trim().Equals(entityType.ToLower().Trim()) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.Id).ToListAsync().ConfigureAwait(false);
                return new GetDiaryResponse
                {
                    Data = new GetDiaryData { Diaries = lst },
                    Message = "Diary entry records retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetDiaryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting diary entry records", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetDiaryResponse> GetDiaryByAnimalIdAsync(int animalId, bool isDeleted, string entityType, int tenantId)
        {
            try
            {
                DateTime? dtDate = null;
                var lstDiaries = from d in _dbContext.Diary
                                    select new DiaryCustom
                                    {
                                        Id = d.Id,
                                        AnimalId = d.AnimalId ?? 0,
                                        TenantOrAnimal = d.TenantOrAnimal,
                                        ActionDate = d.ActionDate ?? dtDate,
                                        Notes = d.Notes,
                                        IsDeleted = d.IsDeleted,
                                        TenantId = d.TenantId ?? 0
                                    };
                var lst = await lstDiaries
                            .Where(a => a.AnimalId.Equals(animalId) && a.TenantOrAnimal.ToLower().Trim().Equals(entityType.ToLower().Trim()) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.Id).ToListAsync().ConfigureAwait(false);
                return new GetDiaryResponse
                {
                    Data = new GetDiaryData { Diaries = lst },
                    Message = "Diary entry records retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetDiaryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting diary entry records", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateDiaryResponse> UpdateDiaryAsync(int id, Diary diary)
        {
            try
            {
                var _diary = await FindAsync(d => d.Id.Equals(id));

                _diary.ActionDate = diary.ActionDate ?? _diary.ActionDate;
                _diary.IsDeleted = false;
                _diary.AnimalId = diary.AnimalId != null && diary.AnimalId.HasValue ? diary.AnimalId.Value : _diary.AnimalId;
                _diary.Animal = diary.AnimalId != null && diary.AnimalId.HasValue && diary.AnimalId.Value > 0 ? _dbContext.Animals.Where(a => a.Id.Equals(diary.AnimalId)).FirstOrDefault().AnimalName : _diary.Animal;
                _diary.DateModified = DateTime.Now;
                _diary.ModifiedBy = _userName;
                _diary.Notes = string.IsNullOrEmpty(diary.Notes) ? _diary.Notes : diary.Notes;
                _diary.TenantOrAnimal = string.IsNullOrEmpty(diary.TenantOrAnimal) ? _diary.TenantOrAnimal : diary.TenantOrAnimal;
                _diary.TenantId = diary.TenantId ?? _diary.TenantId;

                var entity = await base.UpdateAsync(_diary);
                await _dbContext.SaveChangesAsync();

                return new UpdateDiaryResponse()
                {
                    Success = true,
                    Data = new UpdateDiaryData { Id = entity.Id, Diary = entity },
                    Message = "Diary entry updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateDiaryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating diary entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteDiaryResponse> UpdateDiaryByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _diary = await FindAsync(d => d.Id.Equals(id));
                if (_diary != null)
                {
                    _diary.IsDeleted = isDeleted;
                    _diary.DateModified = DateTime.Now;
                    _diary.ModifiedBy = _userName;

                    var diary = await UpdateAsync(_diary);
                    _dbContext.SaveChanges();
                    return new DeleteDiaryResponse
                    {
                        Data = new DeleteDiaryData
                        {
                            IsDeleted = diary.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Diary entry deleted sucessfully!"
                    };

                }
                else
                {
                    return new DeleteDiaryResponse
                    {
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Diary entry not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteDiaryResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating diary entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
