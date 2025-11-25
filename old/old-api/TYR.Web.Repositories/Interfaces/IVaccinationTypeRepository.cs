using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VaccinationTypeResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IVaccinationTypeRepository : IRepositoryBase<VaccinationType>
    {
        Task<AddVaccinationTypeResponse> AddVaccinationTypeAsync(VaccinationType t);
        Task<DeleteVaccinationTypeResponse> UpdateVaccinationTypeByDeletedAsync(int id, bool isDeleted);
        Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAsync(bool isDeleted, int tenantId);
        Task<GetAllVaccinationTypesResponse> GetAllVaccinationTypesAnimalIdAsync(bool isDeleted, int animalTypeId, int tenantId);
        Task<GetAvailableVaccinationTypesResponse> AvailableVaccinationTypes(bool isDeleted, string vaccinationType, int tenantId, int animaltypeId);
        Task<UpdateVaccinationTypeResponse> UpdateVaccinationTypeAsync(VaccinationType t);
    }
}
