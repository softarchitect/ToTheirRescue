using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVolunteerActivityResult;
using TYR.WEB.Models.Response.VolunteerActivityResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class SAVolunteerActivityRepository : RepositoryBase<SAVolunteerActivity>, ISAVolunteerActivityRepository
    {
        public SAVolunteerActivityRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddSAVolunteerActivityResponse> AddSAVolunteerActivityAsync(SAVolunteerActivity t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSAVolunteerActivityResponse
                {
                    Data = new AddSAVolunteerActivityData { Id = t.Id },
                    Message = "Volunteer Activity added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddSAVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSAVolunteerActivityResponse> AvailableSAVolunteerActivities(bool isDeleted, string saVolunteerActivityName)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.SAVolunteerActivityName.Equals(saVolunteerActivityName));
                if (type != null)
                {
                    return (new GetAvailableSAVolunteerActivityResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAVolunteerActivityData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Volunteer Activity already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSAVolunteerActivityResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAVolunteerActivityData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Volunteer Activity available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableSAVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetSAVolunteerActivityResponse> GetAllSAVolunteerActivitiesAsync(bool isDeleted)
        {
            try
            {
                var lstSAVolunteerActivity = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstSAVolunteerActivityOrdered = lstSAVolunteerActivity.OrderBy(a => a.SAVolunteerActivityName).ToList<SAVolunteerActivity>();
                return new GetSAVolunteerActivityResponse
                {
                    Data = new GetSAVolunteerActivityData { SAVolunteerActivities = lstSAVolunteerActivityOrdered },
                    Message = "Volunteer Activity retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetSAVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateSAVolunteerActivityResponse> UpdateSAVolunteerActivityAsync(SAVolunteerActivity t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSAVolunteerActivityResponse()
                {
                    Success = true,
                    Data = new UpdateSAVolunteerActivityData { Id = entity.Id, SAVolunteerActivity = entity },
                    Message = "Volunteer Activity updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateSAVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSAVolunteerActivityResponse> UpdateSAVolunteerActivityByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vSAVolunteerActivity = await GetByIdAsync(id);
                if (vSAVolunteerActivity == null)
                    return new DeleteSAVolunteerActivityResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vSAVolunteerActivity.IsDeleted = isDeleted;
                await UpdateAsync(vSAVolunteerActivity);
                await _context.SaveChangesAsync();
                return new DeleteSAVolunteerActivityResponse()
                {
                    Success = true,
                    Data = new DeleteSAVolunteerActivityData { IsDeleted = true },
                    Message = "Volunteer Activity deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteSAVolunteerActivityResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
