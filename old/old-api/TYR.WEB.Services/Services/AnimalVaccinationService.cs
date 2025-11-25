using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.Web.Repositories.Repositories;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalVaccinationResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalVaccinationService : IAnimalVaccinationService
    {
        private readonly IAnimalVaccinationRepository _animalVaccinationRepository;
        public AnimalVaccinationService(IAnimalVaccinationRepository animalVaccinationRepository) => _animalVaccinationRepository = animalVaccinationRepository;
        public async Task<AddAnimalVaccinationResponse> AddAnimalVaccinationAsync(List<AnimalVaccination> animalVaccinations) =>
            await _animalVaccinationRepository.AddAnimalVaccinationAsync(animalVaccinations);

        public async Task<GetAnimalVaccinationResponse> GetAnimalVaccinationByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId) =>
            await _animalVaccinationRepository.GetAnimalVaccinationByAnimalIdAsync(animalId, isDeleted, blnReminder, tenantId);

        public async Task<GetVaccinationResponse> GetAnimalVaccinationByAnimalIdVaccRecordNoAsync(int animalId, string vaccRecordNo, bool blnReminder, int tenantId) =>
            await _animalVaccinationRepository.GetAnimalVaccinationByAnimalIdVaccRecordNoAsync(animalId, vaccRecordNo, blnReminder, tenantId);

        public async Task<AnimalVaccination> GetAnimalVaccinationByIdAsync(int id) =>
            await _animalVaccinationRepository.GetByIdAsync(id);

        public async Task<UpdateAnimalVaccinationResponse> UpdateAnimalVaccinationAsync(AnimalVaccination animalVaccination, int id) =>
            await _animalVaccinationRepository.UpdateAnimalVaccinationAsync(animalVaccination, id);

        public async Task<DeleteAnimalVaccinationResponse> UpdateAnimalVaccinationByDeletedAsync(int id, bool isDeleted) =>
            await _animalVaccinationRepository.UpdateAnimalVaccinationByDeletedAsync(id, isDeleted);

        public async Task<GetAllAnimalVaccinationResponse> GetAllAnimalVaccinationsAsync(bool isDeleted, bool blnReminder, int days, int tenantId) =>
            await _animalVaccinationRepository.GetAllAnimalVaccinationsAsync(isDeleted, blnReminder, days, tenantId);

        // If we need to check for deleting other reminders then we need to implement this otherwise we will discard this and related repository method
        public async Task<CheckAnimalVaccinationReminderResponse> CheckAnimalVaccinationRemindersExistAsync(int id) => 
            await _animalVaccinationRepository.CheckAnimalVaccinationRemindersExistAsync(id);
    }
}
