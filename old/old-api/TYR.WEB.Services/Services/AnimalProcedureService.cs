using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalProcedureResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AnimalProcedureService : IAnimalProcedureService
    {
        private readonly IAnimalProcedureRepository _animalProcedureRepository;
        public AnimalProcedureService(IAnimalProcedureRepository animalProcedureRepository) => _animalProcedureRepository = animalProcedureRepository;
        public async Task<AddAnimalProcedureResponse> AddAnimalProcedureAsync(List<AnimalProcedure> animalProcedures) => 
            await _animalProcedureRepository.AddAnimalProcedureAsync(animalProcedures);
        
        public async Task<GetAnimalProcedureResponse> GetAnimalProcedureByAnimalIdAsync(int animalId, bool isDeleted, bool blnReminder, int tenantId) =>
            await _animalProcedureRepository.GetAnimalProcedureByAnimalIdAsync(animalId, isDeleted, blnReminder, tenantId);

        public async Task<AnimalProcedure> GetAnimalProcedureByIdAsync(int id) => await _animalProcedureRepository.GetByIdAsync(id);

        public async Task<GetAnimalWeightHistoryResponse> GetAnimalWeightHistoryByAnimalIdAsync(int animalId, int tenantId) =>
            await _animalProcedureRepository.GetAnimalWeightHistoryByAnimalIdAsync(animalId, tenantId);

        public async Task<UpdateAnimalProcedureResponse> UpdateAnimalProcedureAsync(AnimalProcedure t, int id) =>
            await _animalProcedureRepository.UpdateAnimalProcedureAsync(t, id);
        
        public async Task<DeleteAnimalProcedureResponse> UpdateAnimalProcedureByDeletedAsync(int id, bool isDeleted) =>
            await _animalProcedureRepository.UpdateAnimalProcedureByDeletedAsync(id, isDeleted);
        public async Task<GetAllAnimalProcedureResponse> GetAllAnimalProceduresAsync(bool isDeleted, bool blnReminder, int days, int tenantId) =>
            await _animalProcedureRepository.GetAllAnimalProceduresAsync(isDeleted, blnReminder, days, tenantId);


    }
}
