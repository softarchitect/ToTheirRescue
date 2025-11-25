using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalResult;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.Models.ViewModels.AnimalViewModel;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalRepository : RepositoryBase<Animal>, IAnimalRepository
    {
        private readonly TYRDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly string _userName;
        public AnimalRepository(TYRDbContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(dbContext)
        { 
            _dbContext = dbContext; 
            _mapper = mapper;
            _userName = httpContextAccessor.HttpContext.User.Identity.Name;
        }

        public async Task<AddAnimalResponse> AddAnimalAsync(Animal animal)
        {
            try
            {
                var _animal = await AddAsync(animal);

                var animalAnimalTypeVms = new List<AnimalAnimalTypeVm>();
                
                var query = (from a in _dbContext.Animals
                                join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                select new AnimalAnimalTypeVm
                                {
                                    Id = a.Id,
                                    AnimalId = a.AnimalId,
                                    AnimalName = a.AnimalName,
                                    CurrentResident = a.CurrentResident.HasValue ? a.CurrentResident.Value: false,
                                    Breed = a.Breed,
                                    Color = a.Color,
                                    Sex = a.Sex,
                                    SpayedOrNeutered = a.SpayedOrNeutered,
                                    LastMilestone = a.LastMilestone,
                                    AnimalMilestone = _dbContext.AnimalMilestones.Where(an => an.AnimalId.Equals(a.Id) && an.MilestoneType.ToLower().Equals(a.LastMilestone.ToLower())).FirstOrDefault(),
                                    LastMilestoneDate = a.LastMilestoneDate,
                                    Notes = a.Notes,
                                    //OtherIDNo = a.OtherIDNo,
                                    Flag = a.Flag,
                                    FlagReason = a.FlagReason,
                                    Location = a.Location,
                                    IsDeleted = a.IsDeleted,
                                    PcoId = a.PcoId,
                                    Pco = _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault(),
                                    AnimalTypeId = a.AnimalTypeId,
                                    TenantId = a.TenantId,
                                    AnimalType = at.TypeName,
                                    ChronicCondition = a.ChronicCondition,
                                    Status = a.Status,
                                })
                            .Where(a => a.Id.Equals(_animal.Id) && a.IsDeleted.Equals(false));
                var queryAsync = await query.FirstOrDefaultAsync();
                var animalAnimalTypeVm = _mapper.Map<AnimalAnimalTypeVm>(queryAsync);
                animalAnimalTypeVms.Add(animalAnimalTypeVm);
                
                return new AddAnimalResponse
                {
                    Data = new AddAnimalData
                    {
                        Id = _animal.Id,
                        Animal = _animal,
                        AnimalAnimalTypeVms = animalAnimalTypeVms
                    },
                    StatusCode = 200,
                    Success = true,
                    Message = "Animal added successfully!"
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalResponse
                {
                    Errors = new List<string> { "Oops! something went wrong in adding new animal", ex.Message, ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false
                };
            }
        }

        public async Task<AnimalPagedResponse> GetAnimalSearchFilterPagedAsync(int tenantId, bool isDeleted, string searchText, bool isCurrentResident, int limit, int page)
        {
           
            List<AnimalAnimalTypeVm> animalAnimalTypeVms = new();
            int count = 0;
            try
            {
                if (string.IsNullOrEmpty(searchText))
                {
                    var query = (from a in _dbContext.Animals
                                 join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                 select new AnimalAnimalTypeVm
                                 {
                                     Id = a.Id,
                                     AnimalId = a.AnimalId,
                                     //AssignedAnimalId = a.AssignedAnimalId,
                                     AnimalName = a.AnimalName,
                                     CurrentResident = a.CurrentResident.HasValue ? a.CurrentResident.Value : false,
                                     Breed = a.Breed,
                                     Color = a.Color,
                                     Sex = a.Sex,
                                     SpayedOrNeutered = a.SpayedOrNeutered,
                                     LastMilestone = a.LastMilestone,
                                     AnimalMilestone = _dbContext.AnimalMilestones.Where(an => an.AnimalId.Equals(a.AnimalId) && an.MilestoneType.ToLower().Equals(a.LastMilestone.ToLower())).FirstOrDefault(),
                                     LastMilestoneDate = a.LastMilestoneDate,
                                     Notes = a.Notes,
                                     //OtherIDNo = a.OtherIDNo,
                                     Flag = a.Flag,
                                     FlagReason = a.FlagReason,
                                     Location = a.Location,
                                     IsDeleted = a.IsDeleted,
                                     PcoId = a.PcoId,
                                     Pco = _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault(),
                                     AnimalTypeId = a.AnimalTypeId,
                                     TenantId = a.TenantId,
                                     AnimalType = at.TypeName,
                                     ChronicCondition = a.ChronicCondition,
                                     Status = a.Status,
                                 })
                                .Where(p => p.CurrentResident.Equals(isCurrentResident) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId))
                                .OrderBy(p => p.AnimalName)
                                .Skip(limit * (page - 1))
                                .Take(limit);
                    
                    var list = await query.ToListAsync().ConfigureAwait(false);
                    count = await _dbContext.Animals.CountAsync(p => p.CurrentResident.Equals(isCurrentResident) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId));

                    //await FindAllAsync(p => p.Available.Equals(isAvailable) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId));
                   
                    animalAnimalTypeVms = _mapper.Map<List<AnimalAnimalTypeVm>>(list);
                }
                else
                {
                    var query = (from a in _dbContext.Animals
                                join at in _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                select new AnimalAnimalTypeVm
                                {
                                    Id = a.Id,
                                    AnimalId = a.AnimalId,
                                    //AssignedAnimalId = a.AssignedAnimalId,
                                    AnimalName = a.AnimalName,
                                    CurrentResident = a.CurrentResident.HasValue ? a.CurrentResident.Value : false,
                                    Breed = a.Breed,
                                    Color = a.Color,
                                    Sex = a.Sex,
                                    SpayedOrNeutered = a.SpayedOrNeutered,
                                    LastMilestone = a.LastMilestone,
                                    AnimalMilestone = _dbContext.AnimalMilestones.Where(an => an.AnimalId.Equals(a.AnimalId) && an.MilestoneType.ToLower().Equals(a.LastMilestone.ToLower())).FirstOrDefault(),
                                    LastMilestoneDate = a.LastMilestoneDate,
                                    Notes = a.Notes,
                                    //OtherIDNo = a.OtherIDNo,
                                    Flag = a.Flag,
                                    FlagReason = a.FlagReason,
                                    Location = a.Location,
                                    IsDeleted = a.IsDeleted,
                                    PcoId = a.PcoId,
                                    Pco = _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault(),
                                    AnimalTypeId = a.AnimalTypeId,
                                    TenantId = a.TenantId,
                                    AnimalType = at.TypeName,
                                    ChronicCondition = a.ChronicCondition,
                                    Status = a.Status,
                                })
                               .Where(p => p.CurrentResident.Equals(isCurrentResident) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.AnimalName.Contains(searchText))
                               .OrderBy(p => p.AnimalName)
                               .Skip(limit * (page - 1))
                               .Take(limit);
                    var list = await query.ToListAsync().ConfigureAwait(false);
                    count = await  _dbContext.Animals.CountAsync(p => p.CurrentResident.Equals(isCurrentResident) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId));
                    //var animal = await FindAllAsync( p=> p.Available.Equals(isAvailable) && p.IsDeleted.Equals(isDeleted) && p.TenantId.Equals(tenantId) && p.AnimalName.Contains(searchText));
                   
                    animalAnimalTypeVms = _mapper.Map<List<AnimalAnimalTypeVm>>(list);
                }
                return new AnimalPagedResponse
                {
                    Data = new AnimalPageData
                    {
                        CurrentPage = page,
                        Animals = animalAnimalTypeVms,
                        TotalItems = count,
                        TotalPage = (int)Math.Ceiling(count / (double)limit)
                        
                    },
                    Message = "Animal retrived successfully",
                    StatusCode = 200,
                    Success = true

                };
            }
            catch (Exception ex)
            {
                return new AnimalPagedResponse
                {
                    Data = new AnimalPageData
                    {
                        CurrentPage = 0,
                        AnimalsList = null,
                        TotalItems = 0,
                        TotalPage = 0

                    },
                    Errors = new List<string> { "Oops! something went wrong, while retreving animal data", ex.Message, ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false
                };
            }
        }
        public async Task<UpdateAnimalResponse> UpdateAnimalAsync(Animal animal, int id, string updatedBy)
        {
            AnimalAnimalTypeVm animalAnimalTypeVms = new();
            try
            {
                var _animal = await FindAsync(p => p.Id.Equals(id));
                
                if (animal.AnimalName != null) _animal.AnimalName = animal.AnimalName;
                if (animal.Breed != null) _animal.Breed = animal.Breed;
                if (animal.Color != null) _animal.Color = animal.Color;
                if (animal.Sex != null) _animal.Sex = animal.Sex; 
                if (animal.Notes != null) _animal.Notes = animal.Notes;
                //if (animal.OtherIDNo != null) _animal.OtherIDNo = animal.OtherIDNo;
                if (animal.FlagReason != null) _animal.FlagReason = animal.FlagReason;
                if (animal.Location != null) _animal.Location = animal.Location;
                if (animal.AnimalTypeId != null) _animal.AnimalTypeId= animal.AnimalTypeId;
                if (animal.PcoId != null) _animal.PcoId= animal.PcoId;
                if (animal.TenantId != null) _animal.TenantId = animal.TenantId;
                if(animal.LastMilestone != null) _animal.LastMilestone = animal.LastMilestone;
                if(animal.LastMilestoneDate.HasValue) _animal.LastMilestoneDate = animal.LastMilestoneDate.Value;
                //_animal.AssignedAnimalId = animal.AssignedAnimalId;
                _animal.SpayedOrNeutered = animal.SpayedOrNeutered;
                _animal.Flag = animal.Flag;
             
                _animal.ModifiedBy = updatedBy;
                _animal.DateModified = DateTime.Now;
                if(!string.IsNullOrEmpty(animal.ChronicCondition)) _animal.ChronicCondition = animal.ChronicCondition;
                if(!string.IsNullOrEmpty(animal.Status)) _animal.Status = animal.Status;
                
                _animal.CurrentResident = animal.CurrentResident;
                await UpdateAsync(_animal);
                _context.SaveChanges();
                animalAnimalTypeVms = _mapper.Map<AnimalAnimalTypeVm>(_animal);
                var animalType = await _dbContext.AnimalTypes.Where(a => a.Id.Equals(animal.AnimalTypeId)).FirstAsync();
                animalAnimalTypeVms.AnimalType = animalType.TypeName;
                return new UpdateAnimalResponse
                {
                    Data = new UpdateAnimalData { Id = _animal.Id, Animal = animalAnimalTypeVms },
                    Success = true,
                    Message = "Animal updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalResponse
                {
                    Errors = new List<string> { "Oops! something went wrong while animal update", ex.Message, ex.InnerException.ToString() },
                    Success = false,
                    StatusCode = 200
                };
            }

        }

        public async Task<DeleteAnimalResponse> DeleteAnimalAsync(int id, string updatedBy)
        {
            try
            {
                var _animal = await FindAsync(p => p.Id.Equals(id));
                if (_animal != null)
                {
                    _animal.IsDeleted = true;
                    await UpdateAsync(_animal);
                    _context.SaveChanges();
                    return new DeleteAnimalResponse
                    {
                        Data = new DeleteAnimal
                        {
                            IsDeleted = true
                        },
                        StatusCode = 200,
                        Success = true,
                        Message = "Animal deleted sucessfully!"
                    };

                }
                else
                {
                    return new DeleteAnimalResponse
                    {
                        Errors = new List<string> { "Id Does Not Exist" },
                        StatusCode = 200,
                        Success = false,
                        Message = "Animal does not exists"
                    };
                }

            }
            catch (Exception ex)
            {
                return new DeleteAnimalResponse
                {
                    Errors = new List<string> { ex.Message, ex.InnerException.ToString() },
                    StatusCode = 200,
                    Success = false,
                    Message = "Animal does not exists"
                };
            }

        }

        public async Task<AnimalSearchAutoCompleteListResponse> AnimalSearchAutoCompleteAsync(int tenantId, string searchText, int limit)
        {
            List<string> animalName = new();
            try
            {
                if (string.IsNullOrEmpty(searchText))
                {
                    var query = (from a in _dbContext.Animals.Where(a => a.IsDeleted.Equals(false) && a.TenantId.Equals(tenantId))
                                 select new
                                 {
                                     a.AnimalName
                                 }).Distinct().OrderBy(a => a.AnimalName).Take(limit);
                    var list = query.ToListAsync();
                    foreach (var item in await list.ConfigureAwait(false))
                    {
                        animalName.Add(item.AnimalName);
                    }
                    return new AnimalSearchAutoCompleteListResponse
                    {
                        Data = animalName,
                        Message = "Animal name retrieved successfully",
                        StatusCode = 200,
                        Success = true
                    };
                }
                else
                {
                    var query = (from a in _dbContext.Animals.Where(a => a.IsDeleted.Equals(false) && a.AnimalName.StartsWith(searchText) && a.TenantId.Equals(tenantId))
                                 select new
                                 {
                                     a.AnimalName
                                 }).Distinct().OrderBy(a => a.AnimalName).Take(limit);
                    var list = query.ToListAsync();
                    foreach (var item in await list.ConfigureAwait(false))
                    {
                        animalName.Add(item.AnimalName);
                    }
                    return new AnimalSearchAutoCompleteListResponse
                    {
                        Data = animalName,
                        Message = "Animal name retrieved successfully",
                        StatusCode = 200,
                        Success = true
                    };

                }
            }
            catch (Exception ex)
            {
                return new AnimalSearchAutoCompleteListResponse
                {
                    Errors = new List<string> { "Oops! something went wrong in searching animals", ex.Message },
                    Success = false,
                    StatusCode = 200
                };
            }
        }

        public async Task<int> GetLastAnimalIdAsync(int tenantId)
        {
            var query = await _dbContext.Animals.Where(p => p.TenantId.Equals(tenantId) && p.IsDeleted.Equals(false)).OrderByDescending(u => u.Id).FirstOrDefaultAsync();
            if (query != null)
                return query.AnimalId;
            else
                return 0;
        }

        public async Task<AnimalCountResponse> GetAnimalCountAsync(int tenantId)
        {
            try
            {
                var residentAnimalCount = await _dbContext.Animals.CountAsync(p => p.TenantId.Equals(tenantId) && p.CurrentResident.Equals(true) && p.IsDeleted.Equals(false));
                var formerResidentCount = await _dbContext.Animals.CountAsync(p => p.TenantId.Equals(tenantId) && p.CurrentResident.Equals(false) && p.IsDeleted.Equals(false));
                return new AnimalCountResponse
                {
                    Data = new GetAnimalCount
                    {
                        FormarAnimalCount = formerResidentCount,
                        ResidentAnimalCount = residentAnimalCount
                    },
                    Success = true,
                    StatusCode = 200,
                };
            }
            catch(Exception ex)
            {
                return new AnimalCountResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "OOps! something went wrong while getting count of animal", ex.InnerException.ToString()}
                };
            }

        }

        public async Task<GetAnimalResponse> GetAnimalByIdAsync(int animalId)
        {
            try
            {
                var animalResponse = await _dbContext.Animals.Where(a => a.AnimalId.Equals(animalId) && a.IsDeleted.Equals(false)).FirstOrDefaultAsync();
                return new GetAnimalResponse
                {
                    Data = new GetAnimalData { Animal = animalResponse },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "OOps! something went wrong while getting animal", ex.InnerException.ToString() }
                };
            }
        }

        public async Task<GetAnimalListResponse> GetAnimalListByIdsAsync(List<int> animalIds)
        {
            try
            {
                var animalAnimalTypeVms = new List<AnimalAnimalTypeVm>();
                foreach(var animalId in animalIds)
                {
                    var query = (from a in  _dbContext.Animals
                                 join at in  _dbContext.AnimalTypes on a.AnimalTypeId equals at.Id
                                 select new AnimalAnimalTypeVm
                                 {
                                     Id = a.Id,
                                     AnimalId = a.AnimalId,
                                     AnimalName = a.AnimalName,
                                     CurrentResident = a.CurrentResident.HasValue ? a.CurrentResident.Value : false,
                                     Breed = a.Breed,
                                     Color = a.Color,
                                     Sex = a.Sex,
                                     SpayedOrNeutered = a.SpayedOrNeutered,
                                     LastMilestone = a.LastMilestone,
                                     AnimalMilestone = _dbContext.AnimalMilestones.Where(an => an.AnimalId.Equals(a.AnimalId) && an.MilestoneType.ToLower().Equals(a.LastMilestone.ToLower())).FirstOrDefault(),
                                     LastMilestoneDate = a.LastMilestoneDate,
                                     Notes = a.Notes,
                                     //OtherIDNo = a.OtherIDNo,
                                     Flag = a.Flag,
                                     FlagReason = a.FlagReason,
                                     Location = a.Location,
                                     IsDeleted = a.IsDeleted,
                                     PcoId = a.PcoId,
                                     Pco = _dbContext.PCOs.Where(p => p.Id.Equals(a.PcoId)).FirstOrDefault(),
                                     AnimalTypeId = a.AnimalTypeId,
                                     TenantId = a.TenantId,
                                     AnimalType = at.TypeName,
                                     ChronicCondition = a.ChronicCondition,
                                     Status = a.Status,
                                 })
                                .Where(a => a.Id.Equals(animalId) && a.IsDeleted.Equals(false));
                    var queryAsync = await query.FirstOrDefaultAsync();
                    var animalAnimalTypeVm = _mapper.Map<AnimalAnimalTypeVm>(queryAsync);
                    animalAnimalTypeVms.Add(animalAnimalTypeVm);
                }
                return new GetAnimalListResponse
                {
                    Data = new GetAnimalListData { AnimalAnimalTypeVms = animalAnimalTypeVms },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animals retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalListResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "OOps! something went wrong while getting animals", ex.InnerException.ToString() }
                };
            }
        }

        public async Task<UpdateAnimalLocationResponse> UpdateAnimalLocationAsync(List<int> animalIds, string location)
        {
            try
            {
                foreach (var animalId in animalIds)
                {
                    var _animal = await FindAsync(p => p.Id.Equals(animalId));

                    _animal.Location = location;
                    _animal.ModifiedBy = _userName;
                    _animal.DateModified = DateTime.Now;

                    await UpdateAsync(_animal);
                    _context.SaveChanges();
                }

                return new UpdateAnimalLocationResponse
                {
                    Data = new UpdateAnimalLocationData { Result = true },
                    Message = "Animal location updated successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalLocationResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating animal location ", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalPublicityBlurbResponse> UpdateAnimalPublicityBlurbAsync(int animalId, string publicityBlurb)
        {
            try
            {
                var _animal = await FindAsync(a => a.Id.Equals(animalId));

                _animal.PublicityBlurb = publicityBlurb;
                _animal.ModifiedBy = _userName;
                _animal.DateModified = DateTime.Now;

                await UpdateAsync(_animal);
                _context.SaveChanges();
                
                return new UpdateAnimalPublicityBlurbResponse
                {
                    Data = new UpdateAnimalPublicityBlurbData { Result = true },
                    Message = "Animal publicity blurb updated successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalPublicityBlurbResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating publicity blurb ", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalDietResponse> UpdateAnimalDietAsync(List<int> animalIds, string diet)
        {
            try
            {
                foreach (var animalId in animalIds)
                {
                    var _animal = await FindAsync(p => p.Id.Equals(animalId));

                    _animal.Diet = diet;
                    _animal.ModifiedBy = _userName;
                    _animal.DateModified = DateTime.Now;

                    await UpdateAsync(_animal);
                    _context.SaveChanges();
                }

                return new UpdateAnimalDietResponse
                {
                    Data = new UpdateAnimalDietData { Result = true },
                    Message = "Animal diet updated successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalDietResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating animal diet", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalDietResponse> GetAnimalDietByIdAsync(int animalId)
        {
            try
            {
                var animalResponse = await GetByIdAsync(animalId);
                return new GetAnimalDietResponse
                {
                    Data = new GetAnimalDietData { Diet = animalResponse != null ? animalResponse.Diet : string.Empty },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal diet retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalDietResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "OOps! something went wrong while getting animal diet", ex.InnerException.ToString() }
                };
            }
        }
        
        public async Task<GetAnimalPublicityBlurbResponse> GetAnimalPublicityBlurbByIdAsync(int animalId)
        {
            try
            {
                var animalResponse = await GetByIdAsync(animalId);
                return new GetAnimalPublicityBlurbResponse
                {
                    Data = new GetAnimalPublicityBlurbData { PublicityBlurb = animalResponse != null ? animalResponse.PublicityBlurb : string.Empty },
                    Success = true,
                    StatusCode = 200,
                    Message = "Animal publicity blurb retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalPublicityBlurbResponse
                {
                    Success = false,
                    StatusCode = 200,
                    Errors = new List<string> { "OOps! something went wrong while getting animal publicity blurb", ex.InnerException.ToString() }
                };
            }
        }
    }
}
