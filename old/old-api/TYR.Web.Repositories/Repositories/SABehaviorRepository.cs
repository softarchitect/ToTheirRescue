using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.Web.Repositories.Interfaces;
using AutoMapper;
using TYR.WEB.DataAccess;
using Microsoft.AspNetCore.Http;
using TYR.WEB.Models.Response.SABehaviorResult;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class SABehaviorRepository : RepositoryBase<SABehavior>, ISABehaviorRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly string _userName;
        public SABehaviorRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        {
            _dbContext = dbContext;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        public async Task<AddSABehaviorResponse> AddSABehaviorAsync(SABehavior t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSABehaviorResponse
                {
                    Data = new AddSABehaviorData { Id = t.Id },
                    Message = "Behavior added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding behavior record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSABehaviorResponse> AvailableSABehavior(bool isDeleted, string saBehavior, int saAnimaltypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.BehaviorName.Equals(saBehavior) && a.SAAnimalTypeId.Equals(saAnimaltypeId));
                if (type != null)
                {
                    return (new GetAvailableSABehaviorResponse
                    {
                        Success = true,
                        Data = new GetAvailableSABehaviorData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Behavior already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSABehaviorResponse
                    {
                        Success = true,
                        Data = new GetAvailableSABehaviorData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Behavioe available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSABehaviorResponse> GetAllSABehaviorsAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId)
        {
            try
            {
                var lstBehavior = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.SAAnimalTypeId.Equals(saAnimalTypeId));
                var lstBehaviorOrdered = lstBehavior.OrderBy(a => a.BehaviorName).ToList<SABehavior>();
                return new GetAllSABehaviorResponse
                {
                    Data = new GetAllSABehaviorsData { SABehaviors = lstBehaviorOrdered },
                    Message = "Behavior retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSABehaviorResponse> GetAllSABehaviorsAsync(bool isDeleted)
        {
            try
            {
                var lstBehavior = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstBehaviorOrdered = lstBehavior.OrderBy(a => a.BehaviorName).ToList<SABehavior>();
                return new GetAllSABehaviorResponse
                {
                    Data = new GetAllSABehaviorsData { SABehaviors = lstBehaviorOrdered },
                    Message = "Behavior retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateSABehaviorResponse> UpdateSABehaviorAsync(SABehavior t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSABehaviorResponse()
                {
                    Success = true,
                    Data = new UpdateSABehaviorData { Id = entity.Id, SABehavior = entity },
                    Message = "Behavior updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSABehaviorResponse> UpdateSABehaviorByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vBehavior = await GetByIdAsync(id);
                if (vBehavior == null)
                    return new DeleteSABehaviorResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Behavior not found" },
                        StatusCode = 400
                    };

                vBehavior.IsDeleted = isDeleted;
                await UpdateAsync(vBehavior);
                await _context.SaveChangesAsync();
                return new DeleteSABehaviorResponse()
                {
                    Success = true,
                    Data = new DeleteSABehaviorData { IsDeleted = true },
                    Message = "Behavior deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteSABehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
