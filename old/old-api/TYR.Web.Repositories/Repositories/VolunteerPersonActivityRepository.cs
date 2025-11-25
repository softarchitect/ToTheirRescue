using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerPersonActivityResult;

namespace TYR.Web.Repositories.Repositories
{
    public class VolunteerPersonActivityRepository: RepositoryBase<VolunteerPersonActivity>, IVolunteerPersonActivityRepository
    {
        public VolunteerPersonActivityRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddVolunteerPersonActivityResponse> AddVolunteerPersonActivityAsync(VolunteerPersonActivity t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddVolunteerPersonActivityResponse
                {
                    Data = new AddVolunteerPersonActivityData { VolunteerPersonActivity = t },
                    Message = "Volunteer Person activity created successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddVolunteerPersonActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteVolunteerPersonActivityResponse> UpdateVolunteerPersonActivityByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vVolunteerPersonActivity = await GetByIdAsync(id);
                if (vVolunteerPersonActivity == null)
                    return new DeleteVolunteerPersonActivityResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vVolunteerPersonActivity.IsDeleted = isDeleted;
                await base.UpdateAsync(vVolunteerPersonActivity);
                await _context.SaveChangesAsync();
                return new DeleteVolunteerPersonActivityResponse()
                {
                    Success = true,
                    Data = new DeleteVolunteerPersonActivityData { IsDeleted = true },
                    Message = "Volunteer Person Activity deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteVolunteerPersonActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetVolunteerPersonActivityResponse> GetAllVolunteerPersonActivitiesAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstVolunteerPersonActivity = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstVolunteerPersonActivityOrdered = lstVolunteerPersonActivity.OrderBy(a => a.Id).ToList<VolunteerPersonActivity>();
                return new GetVolunteerPersonActivityResponse
                {
                    Data = new GetVolunteerPersonActivityData { VolunteerPersonActivities = lstVolunteerPersonActivityOrdered },
                    Message = "Volunteer Person Activity retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetVolunteerPersonActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateVolunteerPersonActivityResponse> UpdateVolunteerPersonActivityAsync(VolunteerPersonActivity t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateVolunteerPersonActivityResponse()
                {
                    Success = true,
                    Data = new UpdateVolunteerPersonActivityData { Id = entity.Id, VolunteerPersonActivity = entity },
                    Message = "Volunteer Person Activity updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateVolunteerPersonActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<bool> UpdateVolunteerPersonActivitiesAsync(List<VolunteerPersonActivity> volunteerPersonActivities)
        {
            try
            {
                foreach(var activity in volunteerPersonActivities)
                {
                    await base.UpdateAsync(activity);
                    await _context.SaveChangesAsync().ConfigureAwait(false); 
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
