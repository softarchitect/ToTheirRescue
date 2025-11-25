using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalMilestoneResult;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalMilestoneRepository : RepositoryBase<AnimalMilestone>, IAnimalMilestoneRepository
    {
        private readonly TYRDbContext _dbContext;
        private readonly IMapper _mapper;
        public AnimalMilestoneRepository(TYRDbContext dbContext, IMapper mapper) : base(dbContext) 
        { 
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<AddAnimalMilestoneResponse> AddAnimalMilestoneAsync(AnimalMilestone t)
        {
            try
            {
                var animalMilestone = await base.AddAsync(t);
                return new AddAnimalMilestoneResponse
                {
                    Data = new AddAnimalMilestoneData
                    {
                        Id = t.Id,
                        AnimalMilestone = animalMilestone
                    },
                    StatusCode = 200,
                    Success = true,
                    Message = "Animal milestone added successfully!"
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalMilestoneResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding animal milestone record", ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalMilestonesResponse> GetAnimalMilestonesAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstAnimalMilestones = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                return new GetAnimalMilestonesResponse
                {
                    Data = new GetAnimalMilestoneData { AnimalMilestones = lstAnimalMilestones },
                    Message = "Animal milestone record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return new GetAnimalMilestonesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal milestone record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalMilestoneResponse> UpdateAnimalMilestoneAsync(AnimalMilestone t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();

                if (entity.MilestoneType.ToLower() == MilestoneType.IntakeMilestoneValue)
                {
                    var acquisitionway = _dbContext.AcquisitionWays.Where(p => p.TenantId.Equals(entity.TenantId) && (p.AcquisitionWayName.Equals("Owner Surrender") || p.AcquisitionWayName.Equals("Public Surrender")));
                    var acquisitionwayList = await acquisitionway.ToListAsync().ConfigureAwait(false);
                    if (acquisitionwayList.Count >= 1)
                    {
                        var isOwnerOrpublic = acquisitionwayList.Find(x => x.Id.Equals(entity.AcquisitionWayId));
                        if (isOwnerOrpublic != null)
                        {
                            var pcoQuery = _dbContext.PCOs.Where(p => p.Id.Equals(entity.PcoId));
                            entity.PCO = await pcoQuery.FirstAsync().ConfigureAwait(false);
                        }

                    }
                }

                //var query = _dbContext.PCOs.Where(p => p.Id.Equals(entity.PcoId));
                //entity.PCO = await query.FirstAsync().ConfigureAwait(false);


                return new UpdateAnimalMilestoneResponse()
                {
                    Success = true,
                    Data = new UpdateAnimalMilestoneData { Id = entity.Id, AnimalMilestone = entity },
                    Message = "Animal milestone updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalMilestoneResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating animal milestone record" , ex.InnerException.ToString()},
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteAnimalMilestoneResponse> UpdateAnimalMilestoneByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vAnimalMilestone = await GetByIdAsync(id);
                if (vAnimalMilestone == null)
                    return new DeleteAnimalMilestoneResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vAnimalMilestone.IsDeleted = isDeleted;
                await UpdateAsync(vAnimalMilestone);
                await _context.SaveChangesAsync();

                return new DeleteAnimalMilestoneResponse()
                {
                    Success = true,
                    Data = new DeleteAnimalMilestoneData { IsDeleted = true },
                    Message = "Animal milestone deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteAnimalMilestoneResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<AnimalMilestone> GetAnimalMilestoneByAnimalIdAndType(int animalId, string type)
        {
            var milestone = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.MilestoneType.Equals(type) && a.IsDeleted.Equals(false));
            return milestone.FirstOrDefault();
             
        }
        public async Task<bool> DeleteMileStoneByAnimal(int animalId)
        {
            try
            {
                var milstoneToUpdate = await FindAllAsync(a => a.AnimalId.Equals(animalId));
                foreach (var item in milstoneToUpdate)
                {
                    item.IsDeleted = true;
                    var entity = UpdateAsync(item);
                }
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return false;
            }
            
        }

        public async Task<GetAnimalMilestonesResponse> GetAnimalMilestoneByAnimalId(int animalId, int limit, int page, bool isDeleted)
        {
            try
            {
                #region Commented Code
                //var query =  
                //            (from a in _dbContext.AnimalMilestones
                //             select new AnimalMilestone
                //             {
                //                 Id = a.Id,
                //                 MilestoneDate = a.MilestoneDate,
                //                 MilestoneType = a.MilestoneType,
                //                 IsApproxDOB = a.IsApproxDOB,
                //                 Notes = a.Notes,
                //                 OtherRescueIDNo = a.OtherRescueIDNo,
                //                 OtherRescueShelterId = a.OtherRescueShelterId,
                //                 PcoId = a.PcoId,
                //                 PCO = a.PcoId.HasValue && a.PcoId.Value > 0 ? _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault() : null,
                //                 TenantId = a.TenantId,
                //                 AnimalId = a.AnimalId,
                //                 AcquisitionWayName = a.AcquisitionWayName,
                //                 AcquisitionWayId = a.AcquisitionWayId,
                //                 AmountPaidFee = a.AmountPaidFee,
                //                 AmountReceivedFee = a.AmountReceivedFee,
                //                 EnteredBy = a.EnteredBy,
                //             })
                //             .Where(p => p.AnimalId.Equals(animalId) && p.IsDeleted.Equals(isDeleted))
                //             .OrderBy(p => p.Id)
                //             .Skip(limit * (page - 1))
                //             .Take(limit); 
                #endregion

                var query = await
                            _dbContext.AnimalMilestones
                            .Where(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(isDeleted))
                            .OrderBy(a => a.Id)
                            .Skip(limit * (page - 1))
                            .Take(limit)
                            .Select(
                            a => new AnimalMilestone {
                                    Id = a.Id,
                                    MilestoneDate = a.MilestoneDate,
                                    MilestoneType = a.MilestoneType,
                                    IsApproxDOB = a.IsApproxDOB,
                                    Notes = a.Notes,
                                    OtherRescueIDNo = a.OtherRescueIDNo,
                                    OtherRescueShelterId = a.OtherRescueShelterId,
                                    PcoId = a.PcoId,
                                    PCO = a.PcoId.HasValue && a.PcoId.Value > 1 ? _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault() : null,
                                    TenantId = a.TenantId,
                                    AnimalId = a.AnimalId,
                                    AcquisitionWayName = a.AcquisitionWayName,
                                    AcquisitionWayId = a.AcquisitionWayId,
                                    AmountPaidFee = a.AmountPaidFee,
                                    AmountReceivedFee = a.AmountReceivedFee,
                                    EnteredBy = a.EnteredBy
                            }).ToListAsync().ConfigureAwait(false);
               
                #region Commented Code
                //var query = await _dbContext.AnimalMilestones
                //           .Where(p => p.AnimalId.Equals(animalId) && p.IsDeleted.Equals(isDeleted))
                //           .OrderBy(p => p.Id)
                //           .Skip(limit * (page - 1))
                //           .Take(limit)
                //           .ToListAsync().ConfigureAwait(false);
                //var list = await query.ToListAsync().ConfigureAwait(false);
                //var list = await query.ConfigureAwait(false); 
                #endregion
                
                var list = query;
                foreach (var item in list)
                {
                    if (!string.IsNullOrEmpty(item.MilestoneType) && item.MilestoneType.ToLower() == MilestoneType.IntakeMilestoneValue)
                    {
                        var acquisitionway = _dbContext.AcquisitionWays.Where(p => p.TenantId.Equals(item.TenantId) && (p.AcquisitionWayName.Equals("Owner Surrender") || p.AcquisitionWayName.Equals("Public Surrender")));
                        var acquisitionwayList = await acquisitionway.ToListAsync().ConfigureAwait(false);
                        if (acquisitionwayList.Count >= 1)
                        {
                            var isOwnerOrpublic = acquisitionwayList.Find(x => x.Id.Equals(item.AcquisitionWayId));
                            if (isOwnerOrpublic != null)
                            {
                                var pcoQuery = _dbContext.PCOs.Where(p => p.Id.Equals(item.PcoId));
                                item.PCO = await pcoQuery.FirstAsync().ConfigureAwait(false);
                            }

                        }
                    }
                   
                }
                var animalMilestone =_mapper.Map<List<AnimalMilestone>>(list);
                return new GetAnimalMilestonesResponse
                {
                    Data = new GetAnimalMilestoneData { AnimalMilestones = animalMilestone,
                    CurrentPage = page,
                    TotalItems= animalMilestone.Count,
                    TotalPage = (int)Math.Ceiling(animalMilestone.Count / (double)limit)
                    },
                    Message = "Animal milestone record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return new GetAnimalMilestonesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal milestone record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }

        }
        public async Task<AnimalMilestonesCountResponse> GetAnimalMilestoneCountByAnimalId(int animalId)
        {
            try
            {
                var animalMilestones = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(false));
                return new AnimalMilestonesCountResponse
                {
                    Data = new AnimalMilestoneCountData
                    {
                        Count = animalMilestones.Count,
                        AnimalMilestones = animalMilestones
                    },
                    Message = "Animal milestone record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return new AnimalMilestonesCountResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<List<AnimalMilestone>> GetAnimalMilestoneByPCO(int PcoID)
        {
            return await FindAllAsync(a => a.PcoId.Equals(PcoID) && a.MilestoneType.ToLower().Equals(MilestoneType.IntakeMilestoneValue) && a.IsDeleted.Equals(false));
        }

        public async Task<AnimalMilestone> GetLastMilestoneByAnimalIdAsync(int animalId)
        {
            var animalMilestones = await FindAllAsync(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(false));
            var milestone = animalMilestones.OrderByDescending(a => a.DateEntered).FirstOrDefault();
            return milestone;
        }

        public async Task<GetPcoLinkMilestoneVolunteerDonationResponse> GetPcoLinkIntakeMilestoneVolunteerDonationAsync(int pcoId, int tenantId)
        {
            try
            {
                var vAnimalMilestone = await _dbContext.AnimalMilestones
                    .FirstOrDefaultAsync(am => am.PcoId == pcoId
                                            && am.MilestoneType.ToLower() == MilestoneType.IntakeMilestoneValue
                                            && !am.IsDeleted
                                            && am.TenantId == tenantId);
                var vVolunteer = await _dbContext.Volunteers
                        .FirstOrDefaultAsync(v => v.PcoId == pcoId
                                                && !v.IsDeleted
                                                && v.TenantId == tenantId);
                var vDonation = await _dbContext.Donations
                    .FirstOrDefaultAsync(d => d.PcoId == pcoId
                                           && !d.IsDeleted
                                           && d.TenantId == tenantId);
                var vPvd = await _dbContext.ArtifactAttachments
                    .FirstOrDefaultAsync(p => p.PcoId == pcoId
                                            && !p.IsDeleted
                                            && p.TenantId == tenantId);

                return new GetPcoLinkMilestoneVolunteerDonationResponse
                {
                    Data = new GetPcoLinkIntakeMilestoneData { Linked = vAnimalMilestone != null || vVolunteer != null || vDonation != null || vPvd != null },
                    Message = vAnimalMilestone != null || vVolunteer != null || vDonation != null || vPvd != null
                              ? "Pco has linked with milestone, donation, volunteer or PVD."
                              : "Pco has not linked with milestone, donation, volunteer or PVD.",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetPcoLinkMilestoneVolunteerDonationResponse
                {
                    Errors = new List<string>
                                    {
                                        "Oops! Something went wrong while getting PCO linked milestone, donation or volunteer record.",
                                        ex.InnerException?.ToString() ?? ex.Message // Prevent null exceptions
                                    },
                    StatusCode = 400,
                    Success = false
                };
            }
        }


        public async Task<AnimalMilestone> GetAnimalMilestoneAsync(int animalId, int tenantId)
        {
            var animalMilestone = await _dbContext.AnimalMilestones.Where(am => am.AnimalId.Equals(animalId) && am.MilestoneType.Trim().ToLower().Equals("birth") && am.TenantId.Equals(tenantId)).FirstOrDefaultAsync();
            return animalMilestone;
        }

    }
}
