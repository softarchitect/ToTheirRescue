using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AcquisitionWayResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class AcquisitionWayService : IAcquisitionWayService
    {
        private readonly IAcquisitionWayRepository _animalAcquisitionRepository;
        public AcquisitionWayService(IAcquisitionWayRepository animalAcquisitionRepository) => _animalAcquisitionRepository = animalAcquisitionRepository;
        public async Task<AddAcquisitionWayResponse> AddAcquisitionWayAsync(AcquisitionWay t) => await _animalAcquisitionRepository.AddAcquisitionWayAsync(t);
        public async Task<GetAvailableAcquisitionWayResponse> AvailableAnimalAcquisition(bool isDeleted, string acquisition, int tenantId) => await _animalAcquisitionRepository.AvailableAnimalAcquisition(isDeleted, acquisition, tenantId);
        public async Task<bool> DeleteAsync(int id) => await _animalAcquisitionRepository.DeleteAsync(id);

        public async Task<GetAllAcquisitionWayResponse> GetAllAnimalAcquisitionsAsync(bool isDeleted, int tenantId) => await _animalAcquisitionRepository.GetAllAnimalAcquisitionsAsync(isDeleted, tenantId);

        public async Task<List<AcquisitionWay>> GetAllAsync() => await _animalAcquisitionRepository.GetAllAsync();

        public async Task<AcquisitionWay> GetByIdAsync(int id) => await _animalAcquisitionRepository.GetByIdAsync(id);

        public async Task<DeleteAcquisitionWayResponse> UpdateAnimalAcquisitionByDeletedAsync(int id, bool isDeleted) => await _animalAcquisitionRepository.UpdateAnimalAcquisitionByDeletedAsync(id, isDeleted);

        public async Task<UpdateAcquisitionWayResponse> UpdateAcquisitionWayAsync(AcquisitionWay t) => await _animalAcquisitionRepository.UpdateAcquisitionWayAsync(t);
    }
}
