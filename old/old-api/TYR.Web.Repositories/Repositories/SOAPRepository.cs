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
using TYR.WEB.Models.Response.SOAPResult;

namespace TYR.Web.Repositories.Repositories
{
    public class SOAPRepository: RepositoryBase<SOAP>, ISOAPRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public SOAPRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _userName = httpContextAccessor?.HttpContext?.User?.Identity?.Name ?? string.Empty;
        }

        public async Task<AddSOAPResponse> AddSOAPAsync(SOAP soap)
        {
            if (soap == null)
            {
                return new AddSOAPResponse
                {
                    Errors = new List<string> { "Invalid SOAP data provided." },
                    StatusCode = 400,
                    Success = false
                };
            }

            try
            {
                var vSOAP = await base.AddAsync(soap);
                await _dbContext.SaveChangesAsync();

                return new AddSOAPResponse
                {
                    Data = new AddSOAPData { Id = vSOAP.Id, SOAP = vSOAP },
                    Message = "SOAP added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddSOAPResponse
                {
                    Errors = new List<string>
                                        {
                                            "Oops! Something went wrong while adding SOAP record.",
                                            ex.InnerException?.Message ?? ex.Message // Prevents null exception
                                        },
                    StatusCode = 500,
                    Success = false
                };
            }
        }

        public async Task<GetSOAPResponse> GetSOAPByAnimalIdAsync(int animalId, bool isDeleted, int tenantId)
        {
            try
            {
                var lstSOAPs = await _dbContext.SOAPs
                                    .Where(s => s.AnimalId == animalId && s.IsDeleted == isDeleted && s.TenantId == tenantId)
                                    .OrderBy(s => s.Id)
                                    .Select(s => new SOAPCustom
                                    {
                                        Id = s.Id,
                                        AnimalId = s.AnimalId ?? 0,
                                        ActionDate = s.ActionDate, // Nullable type already handles null
                                        IsDeleted = s.IsDeleted,
                                        TenantId = s.TenantId ?? 0,
                                        Assessment = s.Assessment,
                                        HospitalClinicId = s.HospitalClinicId,
                                        Objective = s.Objective,
                                        SOAPPlan = s.SOAPPlan,
                                        Subjective = s.Subjective,
                                        Veterinarian = s.Veterinarian
                                    })
                                    .ToListAsync();

                return new GetSOAPResponse
                {
                    Data = new GetSOAPData { SOAPs = lstSOAPs },
                    Message = "SOAP records retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetSOAPResponse
                {
                    Errors = new List<string>
                                        {
                                            "Oops! Something went wrong while getting SOAP records.",
                                            ex.InnerException?.Message ?? ex.Message // Prevents null exception
                                        },
                    StatusCode = 500,
                    Success = false
                };
            }
        }

        public async Task<GetSOAPResponse> GetSOAPByTenantIdAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstSOAPs = await _dbContext.SOAPs
                                    .Where(s => s.IsDeleted == isDeleted && s.TenantId == tenantId)
                                    .OrderBy(s => s.Id)
                                    .Select(s => new SOAPCustom
                                    {
                                        Id = s.Id,
                                        AnimalId = s.AnimalId ?? 0,
                                        ActionDate = s.ActionDate, // Nullable type already handles null
                                        IsDeleted = s.IsDeleted,
                                        TenantId = s.TenantId ?? 0,
                                        Assessment = s.Assessment,
                                        HospitalClinicId = s.HospitalClinicId,
                                        Objective = s.Objective,
                                        SOAPPlan = s.SOAPPlan,
                                        Subjective = s.Subjective,
                                        Veterinarian = s.Veterinarian
                                    })
                                    .ToListAsync();

                return new GetSOAPResponse
                {
                    Data = new GetSOAPData { SOAPs = lstSOAPs },
                    Message = "SOAP records retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetSOAPResponse
                {
                    Errors = new List<string>
                                    {
                                        "Oops! Something went wrong while getting SOAP records.",
                                        ex.InnerException?.Message ?? ex.Message // Prevents null exception
                                    },
                    StatusCode = 500,
                    Success = false
                };
            }
        }



        //public async Task<GetSOAPResponse> GetSOAPByTenantIdAsync(bool isDeleted, int tenantId)
        //{
        //    try
        //    {
        //        DateTime? dtDate = null;
        //        var lstDiaries = from s in _dbContext.SOAPs
        //                         select new SOAPCustom
        //                         {
        //                             Id = s.Id,
        //                             AnimalId = s.AnimalId ?? 0,
        //                             ActionDate = s.ActionDate ?? dtDate,
        //                             IsDeleted = s.IsDeleted,
        //                             TenantId = s.TenantId ?? 0,
        //                             Assessment = s.Assessment,
        //                             HospitalClinicId = s.HospitalClinicId,
        //                             Objective = s.Objective,
        //                             SOAPPlan = s.SOAPPlan,
        //                             Subjective = s.Subjective,
        //                             Veterinarian = s.Veterinarian
        //                         };
        //        var lst = await lstDiaries
        //                    .Where(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
        //                    .OrderBy(a => a.Id).ToListAsync().ConfigureAwait(false);
        //        return new GetSOAPResponse
        //        {
        //            Data = new GetSOAPData { SOAPs = lst },
        //            Message = "SOAP records retrieved successfully",
        //            StatusCode = 200,
        //            Success = true
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new GetSOAPResponse
        //        {
        //            Errors = new List<string> { "Oops! Something went wrong while getting soap records", ex.InnerException.ToString() },
        //            StatusCode = 400,
        //            Success = false
        //        };
        //    }
        //}

        public async Task<UpdateSOAPResponse> UpdateSOAPAsync(int id, SOAP soap)
        {
            try
            {
                var existingSOAP = await FindAsync(d => d.Id == id);
                if (existingSOAP == null)
                {
                    return new UpdateSOAPResponse
                    {
                        Success = false,
                        Errors = new List<string> { "SOAP record not found." },
                        StatusCode = 404
                    };
                }

                // Update fields only if new values are provided
                existingSOAP.ActionDate = soap.ActionDate ?? existingSOAP.ActionDate;
                existingSOAP.IsDeleted = false;
                existingSOAP.AnimalId = soap.AnimalId ?? existingSOAP.AnimalId;
                existingSOAP.DateModified = DateTime.Now; // Use UtcNow for consistency
                existingSOAP.ModifiedBy = _userName;
                existingSOAP.Subjective = soap.Subjective;
                existingSOAP.Objective = soap.Objective;
                existingSOAP.Assessment = soap.Assessment;
                existingSOAP.SOAPPlan = soap.SOAPPlan;
                existingSOAP.HospitalClinicId = soap.HospitalClinicId;
                existingSOAP.Veterinarian = soap.Veterinarian;
                existingSOAP.TenantId = soap.TenantId ?? existingSOAP.TenantId;

                var updatedEntity = await base.UpdateAsync(existingSOAP);
                await _dbContext.SaveChangesAsync();

                return new UpdateSOAPResponse
                {
                    Success = true,
                    Data = new UpdateSOAPData { Id = updatedEntity.Id, SOAP = updatedEntity },
                    Message = "SOAP updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateSOAPResponse
                {
                    Success = false,
                    Errors = new List<string>
                                    {
                                        "Oops! Something went wrong while updating SOAP record.",
                                        ex.InnerException?.Message ?? ex.Message // Prevents null exception
                                    },
                    StatusCode = 500
                };
            }
        }

        public async Task<DeleteSOAPResponse> UpdateSOAPByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var existingSOAP = await FindAsync(d => d.Id == id);
                if (existingSOAP == null)
                {
                    return new DeleteSOAPResponse
                    {
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 404,
                        Success = false,
                        Message = "SOAP not found."
                    };
                }

                // Update deletion status
                existingSOAP.IsDeleted = isDeleted;
                existingSOAP.DateModified = DateTime.Now; // Use UtcNow for consistency
                existingSOAP.ModifiedBy = _userName;

                var updatedSOAP = await UpdateAsync(existingSOAP);
                await _dbContext.SaveChangesAsync(); // Ensure async SaveChanges

                return new DeleteSOAPResponse
                {
                    Data = new DeleteSOAPData { IsDeleted = updatedSOAP.IsDeleted },
                    StatusCode = 200,
                    Success = true,
                    Message = "SOAP deleted successfully!"
                };
            }
            catch (Exception ex)
            {
                return new DeleteSOAPResponse
                {
                    Errors = new List<string>
                                {
                                    "Oops! Something went wrong while updating SOAP record.",
                                    ex.InnerException?.Message ?? ex.Message // Prevents null exception
                                },
                    StatusCode = 500,
                    Success = false
                };
            }
        }

    }
}
