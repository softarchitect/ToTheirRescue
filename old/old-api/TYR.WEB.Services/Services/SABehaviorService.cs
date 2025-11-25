using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.Response.SABehaviorResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SABehaviorService: ISABehaviorService
    {
        private readonly ISABehaviorRepository _saBehaviorRepository;
        public SABehaviorService(ISABehaviorRepository saBehaviorRepository) => _saBehaviorRepository = saBehaviorRepository;

        public async Task<AddSABehaviorResponse> AddSABehaviorAsync(SABehavior t) => await _saBehaviorRepository.AddSABehaviorAsync(t);

        public async Task<GetAvailableSABehaviorResponse> AvailableSABehavior(bool isDeleted, string saBehavior, int saAnimaltypeId) => await _saBehaviorRepository.AvailableSABehavior(isDeleted, saBehavior, saAnimaltypeId);

        public async Task<bool> DeleteAsync(int id) => await _saBehaviorRepository.DeleteAsync(id);

        public async Task<List<SABehavior>> GetAllAsync() => await _saBehaviorRepository.GetAllAsync();

        public async Task<GetAllSABehaviorResponse> GetAllBehaviorsByAnimalTypeIdAsync(bool isDeleted, int animalTypeId) => await _saBehaviorRepository.GetAllSABehaviorsAnimalTypeIdAsync(isDeleted, animalTypeId);

        public async Task<GetAllSABehaviorResponse> GetAllSABehaviorsAsync(bool isDeleted) => await _saBehaviorRepository.GetAllSABehaviorsAsync(isDeleted);

        public async Task<SABehavior> GetByIdAsync(int id) => await _saBehaviorRepository.GetByIdAsync(id);

        public async Task<UpdateSABehaviorResponse> UpdateSABehaviorAsync(SABehavior t) => await _saBehaviorRepository.UpdateSABehaviorAsync(t);

        public async Task<DeleteSABehaviorResponse> UpdateSABehaviorByDeletedAsync(int id, bool isDeleted) => await _saBehaviorRepository.UpdateSABehaviorByDeletedAsync(id, isDeleted);
    }
}
