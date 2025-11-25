using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.Response.AnimalBehaviorResult;
using TYR.WEB.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalBehaviorRepository : RepositoryBase<AnimalBehavior>, IAnimalBehaviorRepository
    {
        public readonly TYRDbContext _dbContext;
        private readonly IBehaviorRepository _behaviorRepository;
        private readonly IAnimalRepository _animalRepository;
        private readonly ITenantRepository _tenantRepository;
        public AnimalBehaviorRepository(TYRDbContext dbContext, IBehaviorRepository behaviorRepository, IAnimalRepository animalRepository, ITenantRepository tenantRepository) : base(dbContext)
        {
            _dbContext = dbContext; _behaviorRepository = behaviorRepository; _animalRepository = animalRepository;
            _tenantRepository = tenantRepository;
        }
        public async Task<AddAnimalBehaviorResponse> UpsertAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors)
        {
            try
            {
                var lstAnimalBehaviors = new List<AnimalBehavior>();
                foreach(var behavior in animalBehaviors)
                {
                    var animalBehavior = _dbContext.AnimalBehaviors.Where(ab => ab.AnimalId.Equals(behavior.AnimalId.Value) 
                                                        && ab.BehaviorId.Equals(behavior.BehaviorId.Value) 
                                                        && ab.IsDeleted.Equals(false)
                                                        && ab.TenantId.Equals(behavior.TenantId.Value)).FirstOrDefault();
                    var vAnimalBehavior = new AnimalBehavior();
                    if(animalBehavior != null)
                    {
                        // Update Behavior
                        animalBehavior.BehaviorId = behavior.BehaviorId ?? animalBehavior.BehaviorId.Value;
                        animalBehavior.AnimalId = behavior.AnimalId ?? animalBehavior.AnimalId.Value;
                        animalBehavior.TenantId = behavior.TenantId ?? animalBehavior.TenantId.Value;
                        animalBehavior.DateEntered = behavior.DateEntered ?? animalBehavior.DateEntered.Value;
                        animalBehavior.DateModified = behavior.DateModified ?? animalBehavior.DateModified.Value;
                        animalBehavior.EnteredBy = string.IsNullOrEmpty(behavior.EnteredBy) ? animalBehavior.EnteredBy : behavior.EnteredBy;
                        animalBehavior.ModifiedBy = string.IsNullOrEmpty(behavior.ModifiedBy) ? animalBehavior.ModifiedBy : behavior.ModifiedBy;
                        //animalBehavior.Notes = string.IsNullOrEmpty(behavior.Notes) ? animalBehavior.Notes : behavior.Notes;
                        animalBehavior.Notes = behavior.Notes;
                        animalBehavior.YesOrNo = behavior.YesOrNo;

                        vAnimalBehavior = await base.UpdateAsync(animalBehavior);
                    }
                    else
                    {
                        // Insert Behavior
                        vAnimalBehavior = await base.AddAsync(behavior);
                    }
                    await _context.SaveChangesAsync();

                    behavior.Behavior = await _behaviorRepository.GetByIdAsync(vAnimalBehavior.BehaviorId.Value);
                    //behavior.Animal = await _animalRepository.GetByIdAsync(behavior.AnimalId.Value);
                    //behavior.Tenant = await _tenantRepository.GetByIdAsync(behavior.TenantId.Value);
                    lstAnimalBehaviors.Add(vAnimalBehavior);
                }

                return new AddAnimalBehaviorResponse
                {
                    Data = new AddAnimalBehaviorData { AnimalBehaviors = lstAnimalBehaviors },
                    Message = "Animal behaviors added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalBehaviorResponse
                {
                    Errors = new List<string> { "Oops! Something wrong adding animal behaviors record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllAnimalBehaviorsResponse> GetAllAnimalBehaviorsAsync(int animalId, bool isDeleted, int tenantId)
        {
            try
            {
                var lstAnimalBehavior = await (from ab in _dbContext.AnimalBehaviors
                                                join b in _dbContext.Behaviors on ab.BehaviorId equals b.Id
                                                select new AnimalBehaviorCustom
                                                {
                                                    Id = ab.Id,
                                                    BehaviorId = ab.BehaviorId,
                                                    AnimalId = ab.AnimalId,
                                                    BehaviorName = b.BehaviorName,
                                                    DateEntered = ab.DateEntered,
                                                    DateModified = ab.DateModified,
                                                    EnteredBy = ab.EnteredBy,
                                                    IsDeleted = ab.IsDeleted,
                                                    ModifiedBy = ab.ModifiedBy,
                                                    Notes = ab.Notes,
                                                    TenantId = ab.TenantId,
                                                    YesOrNo = ab.YesOrNo
                                                })
                                                .Where(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId))
                                                .OrderBy(a => a.BehaviorName).ToListAsync().ConfigureAwait(false);
                
                return new GetAllAnimalBehaviorsResponse
                {
                    Data = new GetAnimalBehaviorsData { AnimalBehaviors = lstAnimalBehavior },
                    Message = "Animal behaviors retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllAnimalBehaviorsResponse
                {
                    Errors = new List<string> { "Oops! Something wrong getting animal behaviors", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalBehaviorResponse> UpdateAnimalBehaviorAsync(List<AnimalBehavior> animalBehaviors)
        {
            try
            {
                var lstAnimalBehaviors = new List<AnimalBehavior>();
                foreach (var behavior in animalBehaviors)
                {
                    var entity = await base.UpdateAsync(behavior);
                    await _context.SaveChangesAsync();
                    entity.Behavior = await _behaviorRepository.GetByIdAsync(behavior.BehaviorId.Value);
                    entity.Animal = await _animalRepository.GetByIdAsync(behavior.AnimalId.Value);
                    lstAnimalBehaviors.Add(entity);
                }

                return new UpdateAnimalBehaviorResponse
                {
                    Data = new UpdateAnimalBehaviorData { AnimalBehaviors = lstAnimalBehaviors },
                    Success = true,
                    Message = "Animal behaviors updated successfully.",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalBehaviorResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "Oops! Something went wrong while updating the record", ex.InnerException.ToString() }
                };
            }
        }

        public Task<DeleteAnimalBehaviorResponse> UpdateAnimalBehaviorByDeletedAsync(int id, bool isDeleted)
        {
            throw new NotImplementedException();
        }
    }
}
