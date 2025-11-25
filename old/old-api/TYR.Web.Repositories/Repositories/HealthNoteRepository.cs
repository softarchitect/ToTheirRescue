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
using TYR.WEB.Models.Response.HealthNoteResult;

namespace TYR.Web.Repositories.Repositories
{
    public class HealthNoteRepository : RepositoryBase<HealthNote>, IHealthNoteRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public HealthNoteRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        public async Task<AddHealthNoteResponse> AddHealthNoteAsync(HealthNote healthNote)
        {
            try
            {
                var vHealthNote = await base.AddAsync(healthNote);
                await _dbContext.SaveChangesAsync();

                return new AddHealthNoteResponse
                {
                    Data = new AddHealthNoteData { Id = vHealthNote.Id, HealthNote = vHealthNote },
                    Message = "Health note entry added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddHealthNoteResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding health note entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<DeleteHealthNoteResponse> UpdateHealthNoteByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var _healthNote = await FindAsync(d => d.Id.Equals(id));
                if (_healthNote != null)
                {
                    _healthNote.IsDeleted = isDeleted;
                    _healthNote.DateModified = DateTime.Now;
                    _healthNote.ModifiedBy = _userName;

                    var healthNote = await UpdateAsync(_healthNote);
                    _dbContext.SaveChanges();
                    return new DeleteHealthNoteResponse
                    {
                        Data = new DeleteHealthNoteData
                        {
                            IsDeleted = healthNote.IsDeleted
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Health note entry deleted sucessfully!"
                    };

                }
                else
                {
                    return new DeleteHealthNoteResponse
                    {
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Health note entry not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new DeleteHealthNoteResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating health note entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<UpdateHealthNoteResponse> UpdateHealthNoteAsync(int id, HealthNote healthNote)
        {
            try
            {
                var _healthNote = await FindAsync(d => d.Id.Equals(id));

                _healthNote.IsDeleted = false;
                _healthNote.AnimalId = healthNote.AnimalId ;
                _healthNote.DateModified = DateTime.Now;
                _healthNote.ModifiedBy = _userName;
                _healthNote.Note = healthNote.Note;
                //_healthNote.ActionDate = healthNote.ActionDate;
                var entity = await base.UpdateAsync(_healthNote);
                await _dbContext.SaveChangesAsync();

                return new UpdateHealthNoteResponse()
                {
                    Success = true,
                    Data = new UpdateHealthNoteData { Id = entity.Id, HealthNote = entity },
                    Message = "Health note entry updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateHealthNoteResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating health note entry record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<GetHealthNoteResponse> GetHealthNoteByAnimalIdAsync(int animalId, bool isDeleted, int tenantId)
        {
            try
            {
                var lstHealthNotes = from h in _dbContext.HealthNotes
                                 select new HealthNoteCustom
                                 {
                                     Id = h.Id,
                                     AnimalId = h.AnimalId ?? 0,
                                     Note = h.Note,
                                     IsDeleted = h.IsDeleted,
                                     TenantId = h.TenantId ?? 0,
                                     ActionDate = h.ActionDate,
                                     DateEntered = h.DateEntered,
                                     DateModified = h.DateModified
                                 };
                var lst = await lstHealthNotes
                            .Where(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                            .OrderBy(a => a.Id).ToListAsync().ConfigureAwait(false);
                return new GetHealthNoteResponse
                {
                    Data = new GetHealthNoteData { HealthNotes = lst },
                    Message = "Health notes entry records retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetHealthNoteResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting health note entry records", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        //public async Task<GetHealthNoteResponse> GetHealthNoteByTenantIdAsync(bool isDeleted, int tenantId)
        //{
        //    try
        //    {
        //        var lstHealthNotes = from h in _dbContext.HealthNotes
        //                         select new HealthNoteCustom
        //                         {
        //                             Id = h.Id,
        //                             AnimalId = h.AnimalId ?? 0,
        //                             Note = h.Note,
        //                             IsDeleted = h.IsDeleted,
        //                             TenantId = h.TenantId ?? 0
        //                         };
        //        var lst = await lstHealthNotes
        //                    .Where(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
        //                    .OrderBy(a => a.Id).ToListAsync().ConfigureAwait(false);
        //        return new GetHealthNoteResponse
        //        {
        //            Data = new GetHealthNoteData { HealthNotes = lst },
        //            Message = "Health note entry records retrieved successfully",
        //            StatusCode = 200,
        //            Success = true
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new GetHealthNoteResponse
        //        {
        //            Errors = new List<string> { "Oops! Something went wrong while getting health note entry records", ex.InnerException.ToString() },
        //            StatusCode = 400,
        //            Success = false
        //        };
        //    }
        //}
    }
}
