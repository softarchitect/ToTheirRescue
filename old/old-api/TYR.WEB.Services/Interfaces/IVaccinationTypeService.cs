using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IVaccinationTypeService
    {
        Task<List<VaccinationType>> GetAllAsync();
        Task<VaccinationType> GetByIdAsync(int id);
        Task<AddVaccinationTypeResponse> AddVaccinationTypeAsync(VaccinationType t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteVaccinationTypeResponse> UpdateVaccinationTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAsync(bool isDeleted, int tenantId);
        Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesByAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId);
        Task<GetAvailableVaccinationTypesResponse> AvailableVaccinationType(bool isDeleted, string vaccinationType, int tenantId, int animaltypeId);
        Task<UpdateVaccinationTypeResponse> UpdateVaccinationTypeAsync(VaccinationType t);
    }
}
