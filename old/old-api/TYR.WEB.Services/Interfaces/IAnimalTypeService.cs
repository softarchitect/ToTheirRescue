using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalTypeService
    {
        Task<List<AnimalType>> GetAllAsync();
        Task<AnimalType> GetByIdAsync(int id);
        Task<AddAnimalTypeResponse> AddAnimalTypeAsync(AnimalType t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteAnimalTypeResponse> UpdateAnimalTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAnimalTypesResponse> GetAllAnimalTypesAsync(bool isDeleted, int tenantId, string roleName);
        Task<GetAvailableAnimalTypeResponse> AvailableAnimalType(bool isDeleted, string typeName, int tenantId, string roleName);
        Task<UpdateAnimalTypeResponse> UpdateAnimalTypeAsync(AnimalType t);
    }
}
