using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAnimalTypeRepository: IRepositoryBase<AnimalType>
    {
        Task<AddAnimalTypeResponse> AddAnimalTypeAsync(AnimalType t);
        Task<DeleteAnimalTypeResponse> UpdateAnimalTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAnimalTypesResponse> GetAllAnimalTypesAsync(bool isDeleted, int tenantId, string roleName);
        Task<GetAvailableAnimalTypeResponse> AvailableAnimalType(bool isDeleted, string typeName, int tenantId, string roleName);
        Task<UpdateAnimalTypeResponse> UpdateAnimalTypeAsync(AnimalType t);
    }
}
