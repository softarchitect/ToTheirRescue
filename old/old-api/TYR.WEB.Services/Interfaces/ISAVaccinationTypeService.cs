using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVaccinationTypeResult;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISAVaccinationTypeService
    {
        Task<List<SAVaccinationType>> GetAllAsync();
        Task<SAVaccinationType> GetByIdAsync(int id);
        Task<AddSAVaccinationTypeResponse> AddSAVaccinationTypeAsync(SAVaccinationType t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteSAVaccinationTypeResponse> UpdateSAVaccinationTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesAsync(bool isDeleted);
        Task<GetAllSAVaccinationTypesResponse> GetAllSAVaccinationTypesByAnimalIdAsync(bool isDeleted, int saAnimalTypeId);
        Task<GetAvailableSAVaccinationTypeResponse> AvailableSAVaccinationType(bool isDeleted, string saVaccinationType, int saAnimalTypeId);
        Task<UpdateSAVaccinationTypeResponse> UpdateSAVaccinationTypeAsync(SAVaccinationType t);
    }
}
