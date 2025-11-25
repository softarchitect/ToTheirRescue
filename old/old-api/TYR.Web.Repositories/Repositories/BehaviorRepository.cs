using AutoMapper;
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
using TYR.WEB.Models.Response.BehaviorResult;

namespace TYR.Web.Repositories.Repositories
{
    public class BehaviorRepository : RepositoryBase<Behavior>, IBehaviorRepository
    {
        private readonly string _userName;
        public BehaviorRepository(TYRDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext) {
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }
        public async Task<AddBehaviorResponse> AddBehaviorAsync(Behavior t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddBehaviorResponse
                {
                    Data = new AddBehaviorData { Id = t.Id },
                    Message = "Behavior added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddBehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding behavior record" , ex.InnerException.ToString()},
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableBehaviorResponse> AvailableBehavior(bool isDeleted, string behavior, int tenantId, int animaltypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.BehaviorName.Equals(behavior) && a.TenantId.Equals(tenantId) && a.AnimalTypeId.Equals(animaltypeId));
                if (type != null)
                {
                    return (new GetAvailableBehaviorResponse
                    {
                        Success = true,
                        Data = new GetAvailableBehaviorData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Behavior already exists."
                    });
                }
                else
                {
                    return (new GetAvailableBehaviorResponse
                    {
                        Success = true,
                        Data = new GetAvailableBehaviorData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Behavioe available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableBehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
            
        }

        public async Task<GetAllBehaviorsResponse> GetAllBehaviorsAnimalTypeIdAsync(bool isDeleted, int animalTypeId)
        {
            try
            {
                var lstBehavior =  await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.AnimalTypeId.Equals(animalTypeId));
                var lstBehaviorOrdered = lstBehavior.OrderBy(a => a.BehaviorName).ToList<Behavior>();
                return new GetAllBehaviorsResponse
                {
                    Data = new GetAllBehaviorsData { Behaviors = lstBehaviorOrdered },
                    Message = "Behavior retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllBehaviorsResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }  
        }

        public async Task<GetAllBehaviorsResponse> GetAllBehaviorsAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstBehavior = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstBehaviorOrdered = lstBehavior.OrderBy(a => a.BehaviorName).ToList<Behavior>();
                return new GetAllBehaviorsResponse
                {
                    Data = new GetAllBehaviorsData { Behaviors = lstBehaviorOrdered },
                    Message = "Behavior retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllBehaviorsResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }  
        }

        public async Task<DeleteBehaviorResponse> UpdateBehaviorByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vBehavior = await GetByIdAsync(id);
                if (vBehavior == null)
                    return new DeleteBehaviorResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Behavior not found" },
                        StatusCode = 400
                    };

                vBehavior.IsDeleted = isDeleted;
                vBehavior.DateModified = DateTime.Now;
                vBehavior.ModifiedBy = _userName;
                await UpdateAsync(vBehavior);
                await _context.SaveChangesAsync();
                return new DeleteBehaviorResponse()
                {
                    Success = true,
                    Data = new DeleteBehaviorData { IsDeleted = true },
                    Message = "Behavior deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteBehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateBehaviorResponse> UpdateBehaviorAsync(Behavior t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateBehaviorResponse()
                {
                    Success = true,
                    Data = new UpdateBehaviorData { Id = entity.Id, Behavior = entity },
                    Message = "Behavior updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateBehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }

        }
    }
}
