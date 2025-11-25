using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Constants;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalTypeRepository : RepositoryBase<AnimalType>, IAnimalTypeRepository
    {
        
        public AnimalTypeRepository(TYRDbContext dbContext) : base(dbContext) {}
        public async Task<AddAnimalTypeResponse> AddAnimalTypeAsync(AnimalType t)
        {
            try
            {
                await base.AddAsync(t);
                return new AddAnimalTypeResponse
                {
                    Data = new AddAnimalTypeData { Id = t.Id },
                    Message = "Animal Type created successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new AddAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while adding record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAvailableAnimalTypeResponse> AvailableAnimalType(bool isDeleted, string typeName, int tenantId, string roleName)
        {
            try
            {
                var type = new AnimalType();
                if(roleName == UserRoles.SuperAdministrator)
                {
                    type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.TypeName.Equals(typeName) && a.RoleName.Equals(roleName));
                }
                else
                {
                    type = await FindAsync(a => a.IsDeleted.Equals(isDeleted) && a.TypeName.Equals(typeName) && a.TenantId.Equals(tenantId));
                }

                if (type != null)
                {
                    return (new GetAvailableAnimalTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableAnimalTypeData { IsAvailable = false },
                        StatusCode = 200,
                        Message = "Animal Type already exists."
                    });
                }
                else
                {
                    return (new GetAvailableAnimalTypeResponse
                    {
                        Success = true,
                        Data = new GetAvailableAnimalTypeData { IsAvailable = true },
                        StatusCode = 200,
                        Message = "Animal Type available"
                    });
                }
            }
            catch (Exception ex)
            {
                return new GetAvailableAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while checking available record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<GetAnimalTypesResponse> GetAllAnimalTypesAsync(bool isDeleted, int tenantId, string roleName)
        {
            try
            {
                var lstAnimalType = new List<AnimalType>();
                if(!string.IsNullOrEmpty(roleName) && roleName.Equals(UserRoles.SuperAdministrator))
                {
                    lstAnimalType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.RoleName.Equals(roleName));
                }
                else
                {
                    lstAnimalType = await FindAllAsync(a => a.IsDeleted.Equals(isDeleted) && a.TenantId.Equals(tenantId));
                }
                var lstAnimalTypeOrdered = lstAnimalType.OrderBy(a => a.TypeName).ToList<AnimalType>();
                return new GetAnimalTypesResponse {
                    Data = new GetAnimalTypesData { AnimalTypes = lstAnimalTypeOrdered },
                    Message = "Animal Types retrieved successfully",
                    StatusCode = 200,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new GetAnimalTypesResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while getting animal record" , ex.InnerException.ToString()},
                    StatusCode = 400,
                    Success = false
                };
            }
            
        }

        public async Task<DeleteAnimalTypeResponse> UpdateAnimalTypeByDeletedAsync(int id, bool isDeleted)
        {
            try
            {
                var vAnimalType = await GetByIdAsync(id);
                if (vAnimalType == null)
                    return new DeleteAnimalTypeResponse
                    {
                        Success = false,
                        Errors = new List<string> { "Record not found" },
                        StatusCode = 400
                    };

                vAnimalType.IsDeleted = isDeleted;
                await UpdateAsync(vAnimalType);
                await _context.SaveChangesAsync();
                return new DeleteAnimalTypeResponse()
                {
                    Success = true,
                    Data = new DeleteAnimalTypeData { IsDeleted = true },
                    Message = "Animal Type deleted successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new DeleteAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while deleting record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }
        }

        public async Task<UpdateAnimalTypeResponse> UpdateAnimalTypeAsync(AnimalType t)
        {
            try
            {
                var entity = await base.UpdateAsync(t);
                await _context.SaveChangesAsync();
                return new UpdateAnimalTypeResponse()
                {
                    Success = true,
                    Data = new UpdateAnimalTypeData { Id = entity.Id, AnimalType = entity },
                    Message = "Animal Type updated successfully",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new UpdateAnimalTypeResponse
                {
                    Errors = new List<string> { "Oops! Something went wrong while updating record", ex.InnerException.ToString() },
                    StatusCode = 400,
                    Success = false
                };
            }

        }

    }
}
