using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAHealthProcedureResult;


namespace TYR.Web.Repositories.Repositories
{
    public class SAHealthProcedureRepository : RepositoryBase<SAHealthProcedure>, ISAHealthProcedureRepository
    {
        public SAHealthProcedureRepository(TYRDbContext dbContext) : base(dbContext) { }
        public async Task<AddSAHealthProcedureResponse> AddSAHealthProcedureAsync(SAHealthProcedure t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSAHealthProcedureResponse
                {
                    Data = new AddSAHealthProcedureDataData { Id = t.Id },
                    Message = "Health Procedure added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new AddSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSAHealthProcedureResponse> AvailableSAHealthProcedure(bool isDeleted, string saHealthProcedure, int saAnimalTypeId)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.Kind.Equals(saHealthProcedure) && a.SAAnimalTypeId.Equals(saAnimalTypeId));
                if (type != null)
                {
                    return (new GetAvailableSAHealthProcedureResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAHealthProceduresData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Health Procedure already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSAHealthProcedureResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAHealthProceduresData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Health Procedure available"
                    });
                }
            }
            catch (Exception)
            {
                return new GetAvailableSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId)
        {
            try
            {
                var lstSAHealthProcedure = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.SAAnimalTypeId.Equals(saAnimalTypeId));
                var lstSAHealthProcedureOrdered = lstSAHealthProcedure.OrderBy(a => a.Kind).ToList<SAHealthProcedure>();
                return new GetAllSAHealthProcedureResponse
                {
                    Data = new GetAllSAHealthProceduresData { SAHealthProcedures = lstSAHealthProcedureOrdered },
                    Message = "Health Procedure retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAllSAHealthProcedureResponse> GetAllSAHealthProceduresAsync(bool isDeleted)
        {
            try
            {
                var lstSAHealthProcedure = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstSAHealthProceOrdered = lstSAHealthProcedure.OrderBy(a => a.Kind).ToList<SAHealthProcedure>();
                return new GetAllSAHealthProcedureResponse
                {
                    Data = new GetAllSAHealthProceduresData { SAHealthProcedures = lstSAHealthProceOrdered },
                    Message = "Health Procedure retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception)
            {
                return new GetAllSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong whille getting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateSAHealthProcedureResponse> UpdateSAHealthProcedureAsync(SAHealthProcedure t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSAHealthProcedureResponse()
                {
                    Success = true,
                    Data = new UpdateSAHealthProcedureData { Id = entity.Id, SAHealthProcedure = entity },
                    Message = "Health Procedure updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new UpdateSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSAHealthProcedureResponse> UpdateSAHealthProcedureByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vSAHealthProcedure = await GetByIdAsync(id);
                if (vSAHealthProcedure == null)
                    return new DeleteSAHealthProcedureResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Health Procedure not found" },
                        StatusCode = 400
                    };

                vSAHealthProcedure.IsDeleted = isDeleted;
                await UpdateAsync(vSAHealthProcedure);
                await _context.SaveChangesAsync();
                return new DeleteSAHealthProcedureResponse()
                {
                    Success = true,
                    Data = new DeleteSAHealthProcedureData { IsDeleted = true },
                    Message = "Health Procedure deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception)
            {
                return new DeleteSAHealthProcedureResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record" },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
