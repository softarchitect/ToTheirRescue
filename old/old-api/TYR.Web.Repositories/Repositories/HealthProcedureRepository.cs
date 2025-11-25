using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthProcedureResult;

namespace TYR.Web.Repositories.Repositories
{
    public class HealthProcedureRepository : RepositoryBase<HealthProcedure>, IHealthProcedureRepository
    {
        public HealthProcedureRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddHealthProcedureResponse> AddHealthProcedureAsync(HealthProcedure t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddHealthProcedureResponse
                {
                    Data = new AddHealthProcedureDataData { Id = t.Id },
                    Message = "Health Procedure added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableHealthProcedureResponse> AvailableHealthProcedure(bool isDeleted, string healthProcedure, int tenantId, int animaltypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.Kind.Equals(healthProcedure) && a.TenantId.Equals(tenantId) && a.AnimalTypeId.Equals(animaltypeId));
                if (type != null)
                {
                    return (new GetAvailableHealthProcedureResponse
                    {
                        Success = true,
                        Data = new GetAvailableHealthProceduresData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Health Procedure already exists."
                    });
                }
                else
                {
                    return (new GetAvailableHealthProcedureResponse
                    {
                        Success = true,
                        Data = new GetAvailableHealthProceduresData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Health Procedure available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllHealthProcedureResponse> GetAllHealthProceduresAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId)
        {
            try
            {
                var lstHealthProcedure = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.AnimalTypeId.Equals(animalTypeId) && a.TenantId.Equals(tenantId));
                var lstHealthProcedureOrdered = lstHealthProcedure.OrderBy(a => a.Kind).ToList<HealthProcedure>();
                return new GetAllHealthProcedureResponse
                {
                    Data = new GetAllHealthProceduresData { HealthProcedures = lstHealthProcedureOrdered },
                    Message = "Health Procedure retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllHealthProcedureResponse> GetAllHealthProceduresAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstHealthProcedure = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstHealthProceOrdered = lstHealthProcedure.OrderBy(a => a.Kind).ToList<HealthProcedure>();
                return new GetAllHealthProcedureResponse
                {
                    Data = new GetAllHealthProceduresData { HealthProcedures = lstHealthProceOrdered },
                    Message = "Health Procedure retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong whille getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateHealthProcedureResponse> UpdateHealthProcedureAsync(HealthProcedure t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateHealthProcedureResponse()
                {
                    Success = true,
                    Data = new UpdateHealthProcedureData { Id = entity.Id, HealthProcedure = entity },
                    Message = "Health Procedure updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteHealthProcedureResponse> UpdateHealthProcedureByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vHealthProcedure = await GetByIdAsync(id);
                if (vHealthProcedure == null)
                    return new DeleteHealthProcedureResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Health Procedure not found" },
                        StatusCode = 400
                    };

                vHealthProcedure.IsDeleted = isDeleted;
                await UpdateAsync(vHealthProcedure);
                await _context.SaveChangesAsync();
                return new DeleteHealthProcedureResponse()
                {
                    Success = true,
                    Data = new DeleteHealthProcedureData { IsDeleted = true },
                    Message = "Health Procedure deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
