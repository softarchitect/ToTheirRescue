using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVaccinationTypeResult;

namespace TYR.Web.Repositories.Repositories
{
    public class SAVaccinationTypeRepository : RepositoryBase<SAVaccinationType>, ISAVaccinationTypeRepository
    {
        public SAVaccinationTypeRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddSAVaccinationTypeResponse> AddSAVaccinationTypeAsync(SAVaccinationType t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSAVaccinationTypeResponse
                {
                    Data = new AddSAVaccinationTypeData { Id = t.Id },
                    Message = "Vaccination Type added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddSAVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSAVaccinationTypeResponse> AvailableSAVaccinationType(bool isDeleted, string saVaccinationType, int saAnimalTypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.Kind.Equals(saVaccinationType) && a.SAAnimalTypeId.Equals(saAnimalTypeId));
                if (type != null)
                {
                    return (new GetAvailableSAVaccinationTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAVaccinationTypeData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Vaccination Type already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSAVaccinationTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAVaccinationTypeData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Vaccination Type available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableSAVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypeAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId)
        {
            try
            {
                var lstSAVaccinationType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.SAAnimalTypeId.Equals(saAnimalTypeId));
                var lstSAVaccinationTypeOrdered = lstSAVaccinationType.OrderBy(a => a.Kind).ToList<SAVaccinationType>();
                return new GetAllSAVaccinationTypesResponse
                {
                    Data = new GetAllSAVaccinationTypesData { SAVaccinationTypes = lstSAVaccinationTypeOrdered },
                    Message = "Vaccination Type retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllSAVaccinationTypesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesAsync(bool isDeleted)
        {
            try
            {
                var lstSAVaccinationType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstSAVaccinationTypeOrdered = lstSAVaccinationType.OrderBy(a => a.Kind).ToList<SAVaccinationType>();
                return new GetAllSAVaccinationTypesResponse
                {
                    Data = new GetAllSAVaccinationTypesData { SAVaccinationTypes = lstSAVaccinationTypeOrdered },
                    Message = "Vaccination Type retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAllSAVaccinationTypesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateSAVaccinationTypeResponse> UpdateSAVaccinationTypeAsync(SAVaccinationType t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSAVaccinationTypeResponse()
                {
                    Success = true,
                    Data = new UpdateSAVaccinationTypeData { Id = entity.Id, SAVaccinationType = entity },
                    Message = "Vaccination Type updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateSAVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSAVaccinationTypeResponse> UpdateSAVaccinationTypeByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vSAVaccinationType = await GetByIdAsync(id);
                if (vSAVaccinationType == null)
                    return new DeleteSAVaccinationTypeResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Vaccination Type not found" },
                        StatusCode = 400
                    };

                vSAVaccinationType.IsDeleted = isDeleted;
                await UpdateAsync(vSAVaccinationType);
                await _context.SaveChangesAsync();
                return new DeleteSAVaccinationTypeResponse()
                {
                    Success = true,
                    Data = new DeleteSAVaccinationTypeData { IsDeleted = true },
                    Message = "Vaccination Type deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteSAVaccinationTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
