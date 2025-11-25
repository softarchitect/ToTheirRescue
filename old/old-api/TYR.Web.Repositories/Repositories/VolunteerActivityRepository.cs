using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;

namespace TYR.Web.Repositories.Repositories
{
    public class VolunteerActivityRepository : RepositoryBase<VolunteerActivity>, IVolunteerActivityRepository
    {
        public VolunteerActivityRepository(TYRDbContext dbContext) : base(dbContext) { }

        public async Task<AddVolunteerActivityResponse> AddVolunteerActivityAsync(VolunteerActivity t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddVolunteerActivityResponse
                {
                    Data = new AddVolunteerActivityData { Id = t.Id },
                    Message = "Volunteer Activity added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableVolunteerActivityResponse> AvailableVolunteerActivities(bool isDeleted, string volunteerActivityName, int tenantId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.VolunteerActivityName.Equals(volunteerActivityName) && a.TenantId.Equals(tenantId));
                if (type != null)
                {
                    return (new GetAvailableVolunteerActivityResponse
                    {
                        Success = true,
                        Data = new GetAvailableVolunteerActivityData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Volunteer Activity already exists."
                    });
                }
                else
                {
                    return (new GetAvailableVolunteerActivityResponse
                    {
                        Success = true,
                        Data = new GetAvailableVolunteerActivityData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Volunteer Activity available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetVolunteerActivityResponse> GetAllVolunteerActivitiesAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstVolunteerActivity = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstVolunteerActivityOrdered = lstVolunteerActivity.OrderBy(a => a.VolunteerActivityName).ToList<VolunteerActivity>();
                return new GetVolunteerActivityResponse
                {
                    Data = new GetVolunteerActivityData { VolunteerActivities = lstVolunteerActivityOrdered },
                    Message = "Volunteer Activity retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" , ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateVolunteerActivityResponse> UpdateVolunteerActivityAsync(VolunteerActivity t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateVolunteerActivityResponse()
                {
                    Success = true,
                    Data = new UpdateVolunteerActivityData { Id = entity.Id, VolunteerActivity = entity },
                    Message = "Volunteer Activity updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteVolunteerActivityResponse> UpdateVolunteerActivityByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vVolunteerActivity = await GetByIdAsync(id);
                if (vVolunteerActivity == null)
                    return new DeleteVolunteerActivityResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vVolunteerActivity.IsDeleted = isDeleted;
                await UpdateAsync(vVolunteerActivity);
                await _context.SaveChangesAsync();
                return new DeleteVolunteerActivityResponse()
                {
                    Success = true,
                    Data = new DeleteVolunteerActivityData { IsDeleted = true },
                    Message = "Volunteer Activity deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
