using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.SAAnimalTypeResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISAAnimalTypeRepository: IRepositoryBase<SAAnimalType>
    {
        Task<AddSAAnimalTypeResponse> AddSAAnimalTypeAsync(SAAnimalType t);
        Task<DeleteSAAnimalTypeResponse> UpdateSAAnimalTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetSAAnimalTypeResponse> GetAllSAAnimalTypeAsync(bool isDeleted);
        Task<GetAvailableSAAnimalTypeResponse> AvailableSAAnimalType(bool isDeleted, string typeName);
        Task<UpdateSAAnimalTypeResponse> UpdateSAAnimalTypeAsync(SAAnimalType t);
        Task<SAAnimalType> GetSAAnimalTypeByAnimalTypeNameAsync(string typeName);
    }
}
