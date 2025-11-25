using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVolunteerActivityResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SAVolunteerActivityService : ISAVolunteerActivityService
    {
        private readonly ISAVolunteerActivityRepository _saVolunteerActivityRepository;
        public SAVolunteerActivityService(ISAVolunteerActivityRepository saVolunteerActivityRepository) => _saVolunteerActivityRepository = saVolunteerActivityRepository;
        public async Task<AddSAVolunteerActivityResponse> AddSAVolunteerActivityAsync(SAVolunteerActivity t)
            => await _saVolunteerActivityRepository.AddSAVolunteerActivityAsync(t);

        public async Task<GetAvailableSAVolunteerActivityResponse> AvailableSAVolunteerActivities(bool isDeleted, string saVolunteerActivityName)
            => await _saVolunteerActivityRepository.AvailableSAVolunteerActivities(isDeleted, saVolunteerActivityName);

        public async Task<bool> DeleteAsync(int id) => await _saVolunteerActivityRepository.DeleteAsync(id);

        public async Task<List<SAVolunteerActivity>> GetAllAsync() => await _saVolunteerActivityRepository.GetAllAsync();

        public async Task<GetSAVolunteerActivityResponse> GetAllSAVolunteerActivitiesAsync(bool isDeleted)
            => await _saVolunteerActivityRepository.GetAllSAVolunteerActivitiesAsync(isDeleted);

        public async Task<SAVolunteerActivity> GetByIdAsync(int id) => await _saVolunteerActivityRepository.GetByIdAsync(id);

        public async Task<UpdateSAVolunteerActivityResponse> UpdateSAVolunteerActivity(SAVolunteerActivity t)
            => await _saVolunteerActivityRepository.UpdateSAVolunteerActivityAsync(t);

        public async Task<DeleteSAVolunteerActivityResponse> UpdateSAVolunteerActivityByDeletedAsync(int id, bool isDeleted)
            => await _saVolunteerActivityRepository.UpdateSAVolunteerActivityByDeletedAsync(id, isDeleted);
    }
}
