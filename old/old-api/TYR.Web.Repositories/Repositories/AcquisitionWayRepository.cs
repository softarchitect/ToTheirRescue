using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AcquisitionWayResult;

namespace TYR.Web.Repositories.Repositories
{
    public class AcquisitionWayRepository : RepositoryBase<AcquisitionWay>, IAcquisitionWayRepository
    {
        public AcquisitionWayRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddAcquisitionWayResponse> AddAcquisitionWayAsync(AcquisitionWay t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddAcquisitionWayResponse
                {
                    Data = new AddAcquisitionWayData { Id = t.Id },
                    Message = "Acquisition Way created successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAcquisitionWayResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding AcquisitionWay record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
        public async Task<GetAvailableAcquisitionWayResponse> AvailableAnimalAcquisition(bool isDeleted, string acquisitionWay, int tenantId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.AcquisitionWayName.Equals(acquisitionWay) && a.TenantId.Equals(tenantId));
                if (type != null)
                {
                    return (new GetAvailableAcquisitionWayResponse
                    {
                        Success = true,
                        Data = new GetAvailableAnimalAcquisitionData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Acquisition Way already exists."
                    });
                }
                else
                {
                    return (new GetAvailableAcquisitionWayResponse
                    {
                        Success = true,
                        Data = new GetAvailableAnimalAcquisitionData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Acquisition Way available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableAcquisitionWayResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available AcquisitionWay record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAcquisitionWayResponse> GetAllAnimalAcquisitionsAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstAcquisitionsWay = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstAcquisitionsWayOrdered = lstAcquisitionsWay.OrderBy(a => a.AcquisitionWayName).ToList<AcquisitionWay>();
                return new GetAllAcquisitionWayResponse
                {
                    Data = new GetAllAcquisitionWayData { AcquisitionWays = lstAcquisitionsWayOrdered },
                    Message = "Acquisition Way record retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return new GetAllAcquisitionWayResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting AcquisitionWay record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
            
        }

        public async Task<DeleteAcquisitionWayResponse> UpdateAnimalAcquisitionByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vAnimalAcquisition = await GetByIdAsync(id);
                if (vAnimalAcquisition == null)
                    return new DeleteAcquisitionWayResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record for AcquisitionWay not found" },
                        StatusCode = 400
                    };

                vAnimalAcquisition.IsDeleted = isDeleted;
                await UpdateAsync(vAnimalAcquisition);
                await _context.SaveChangesAsync();
                return new DeleteAcquisitionWayResponse()
                {
                    Success = true,
                    Data = new DeletedAcquisitionsWayData { IsDeleted = true },
                    Message = "Acquisition Way deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteAcquisitionWayResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAcquisitionWayResponse> UpdateAcquisitionWayAsync(AcquisitionWay t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateAcquisitionWayResponse()
                {
                    Success = true,
                    Data = new UpdateAnimalAcquisitionData { Id = entity.Id, AcquisitionWay = entity },
                    Message = "Acquisition Way updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateAcquisitionWayResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }

        }
    }
}
