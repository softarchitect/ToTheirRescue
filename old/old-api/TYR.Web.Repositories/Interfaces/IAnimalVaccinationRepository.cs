using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalVaccinationResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAnimalVaccinationRepository : IRepositoryBase<AnimalVaccination>
    {
        Task<AddAnimalVaccinationResponse> AddAnimalVaccinationAsync(List<AnimalVaccination> animalVaccinations);
        Task<DeleteAnimalVaccinationResponse> UpdateAnimalVaccinationByDeletedAsync(int id, bool isDeleted);
        Task<UpdateAnimalVaccinationResponse> UpdateAnimalVaccinationAsync(AnimalVaccination animalVaccination, int id);
        Task<GetAnimalVaccinationResponse> GetAnimalVaccinationByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId);
        Task<GetVaccinationResponse> GetAnimalVaccinationByAnimalIdVaccRecordNoAsync(int animalId, string vaccRecordNo, bool blnReminder, int tenantId);
        //Task<GetVaccinationResponse> GetAnimalVaccinationsByVaccRecordNoAsync(string vaccRecordNo, int tenantId);
        Task<GetVaccinationResponse> GetAnimalVaccinationsByVaccRecordNoAsync(int animalId, int kindId, int tenantId, string vaccRecordNo);
        Task<GetAllAnimalVaccinationResponse> GetAllAnimalVaccinationsAsync(bool isDeleted, bool blnReminder, int days, int tenantId);
        Task<CheckAnimalVaccinationReminderResponse> CheckAnimalVaccinationRemindersExistAsync(int id);
    }
}
