using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVaccinationTypeResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISAVaccinationTypeRepository: IRepositoryBase<SAVaccinationType>
    {
        Task<AddSAVaccinationTypeResponse> AddSAVaccinationTypeAsync(SAVaccinationType t);
        Task<DeleteSAVaccinationTypeResponse> UpdateSAVaccinationTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesAsync(bool isDeleted);
        Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypeAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId);
        Task<GetAvailableSAVaccinationTypeResponse> AvailableSAVaccinationType(bool isDeleted, string saVaccinationType, int saAnimalTypeId);
        Task<UpdateSAVaccinationTypeResponse> UpdateSAVaccinationTypeAsync(SAVaccinationType t);
    }
}
