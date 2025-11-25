using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.SAAnimalTypeResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Repositories
{
    public class SAAnimalTypeRepository : RepositoryBase<SAAnimalType>, ISAAnimalTypeRepository
    {
        public SAAnimalTypeRepository(TYRDbContext context) : base(context) {}

        public async Task<AddSAAnimalTypeResponse> AddSAAnimalTypeAsync(SAAnimalType t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddSAAnimalTypeResponse
                {
                    Data = new AddSAAnimalTypeData { Id = t.Id },
                    Message = "SA Animal Type added successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddSAAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableSAAnimalTypeResponse> AvailableSAAnimalType(bool isDeleted, string typeName)
        {
            try
            {
                var type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.TypeName.Equals(typeName));
                if (type != null)
                {
                    return (new GetAvailableSAAnimalTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAAnimalTypeData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "SA Animal Type already exists."
                    });
                }
                else
                {
                    return (new GetAvailableSAAnimalTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableSAAnimalTypeData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "SA Animal Type available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableSAAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetSAAnimalTypeResponse> GetAllSAAnimalTypeAsync(bool isDeleted)
        {
            try
            {
                var lstSAAnimalType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted));
                var lstSAAnimalTypeOrdered = lstSAAnimalType.OrderBy(a => a.TypeName).ToList<SAAnimalType>();
                return new GetSAAnimalTypeResponse
                {
                    Data = new GetSAAnimalTypesData { SAAnimalTypes = lstSAAnimalTypeOrdered },
                    Message = "SA Animal Types retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetSAAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<SAAnimalType> GetSAAnimalTypeByAnimalTypeNameAsync(string typeName)
        {
            SAAnimalType saAnimalType = new SAAnimalType();
            try
            {
                saAnimalType = await FindAsync(a => a.TypeName.ToLower().Equals(typeName.ToLower()) && a.IsDeleted.Equals(false));
                return saAnimalType;
            }
            catch (Exception)
            {
                return saAnimalType;
            }
        }

        public async Task<UpdateSAAnimalTypeResponse> UpdateSAAnimalTypeAsync(SAAnimalType t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateSAAnimalTypeResponse()
                {
                    Success = true,
                    Data = new UpdateSAAnimalTypeData { Id = entity.Id, SAAnimalType = entity },
                    Message = "SA Animal Type updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateSAAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<DeleteSAAnimalTypeResponse> UpdateSAAnimalTypeByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vSAAnimalType = await GetByIdAsync(id);
                if (vSAAnimalType == null)
                    return new DeleteSAAnimalTypeResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vSAAnimalType.IsDeleted = isDeleted;
                await UpdateAsync(vSAAnimalType);
                await _context.SaveChangesAsync();
                return new DeleteSAAnimalTypeResponse()
                {
                    Success = true,
                    Data = new DeleteSAAnimalTypeData { IsDeleted = true },
                    Message = "SA Animal Type deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteSAAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }
    }
}
