using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.Web.Repositories.Repositories
{
    public class VaccinationTypeRepository : RepositoryBase<VaccinationType>, IVaccinationTypeRepository
    {
        public VaccinationTypeRepository(TYRDbContext dbContext) : base(dbContext) { }

        public async Task<AddVaccinationTypeResponse> AddVaccinationTypeAsync(VaccinationType t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddVaccinationTypeResponse
                {
                    Data = new AddVaccinationTypeData { Id = t.Id },
                    Message = "Vaccination Type added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableVaccinationTypesResponse> AvailableVaccinationTypes(bool isDeleted, string vaccinationType, int tenantId, int animaltypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.Kind.Equals(vaccinationType) && a.TenantId.Equals(tenantId) && a.AnimalTypeId.Equals(animaltypeId));
                if (type != null)
                {
                    return (new GetAvailableVaccinationTypesResponse
                    {
                        Success = true,
                        Data = new GetAvailableVaccinationTypesData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Vaccination Type already exists."
                    });
                }
                else
                {
                    return (new GetAvailableVaccinationTypesResponse
                    {
                        Success = true,
                        Data = new GetAvailableVaccinationTypesData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Vaccination Type available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableVaccinationTypesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId)
        {
            try
            {
                var lstVaccinationType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.AnimalTypeId.Equals(animalTypeId) && a.TenantId.Equals(tenantId));
                var lstVaccinationTypeOrdered = lstVaccinationType.OrderBy(a => a.Kind).ToList<VaccinationType>();
                return new GetAllVaccinationTypesResponse
                {
                    Data = new GetAllVaccinationTypesData { VaccinationTypes = lstVaccinationTypeOrdered },
                    Message = "Vaccination Type retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllVaccinationTypesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAsync(bool isDeleted, int tenantId)
        {
            try
            {
                var lstVaccinationType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                var lstVaccinationTypeOrdered = lstVaccinationType.OrderBy(a => a.Kind).ToList<VaccinationType>();
                return new GetAllVaccinationTypesResponse
                {
                    Data = new GetAllVaccinationTypesData { VaccinationTypes = lstVaccinationTypeOrdered },
                    Message = "Vaccination Type retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllVaccinationTypesResponse
                {
                    Errors = new List<string> {"Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateVaccinationTypeResponse> UpdateVaccinationTypeAsync(VaccinationType t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateVaccinationTypeResponse()
                {
                    Success = true,
                    Data = new UpdateVaccinationTypeData { Id = entity.Id, vaccinationType = entity },
                    Message = "Vaccination Type updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" , ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteVaccinationTypeResponse> UpdateVaccinationTypeByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vVaccinationType = await GetByIdAsync(id);
                if (vVaccinationType == null)
                    return new DeleteVaccinationTypeResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Vaccination Type not found" },
                        StatusCode = 400
                    };

                vVaccinationType.IsDeleted = isDeleted;
                await UpdateAsync(vVaccinationType);
                await _context.SaveChangesAsync();
                return new DeleteVaccinationTypeResponse()
                {
                    Success = true,
                    Data = new DeleteVaccinationTypeData { IsDeleted = true },
                    Message = "Vaccination Type deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteVaccinationTypeResponse 
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString()  },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
