using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class VolunteerActivityService: IVolunteerActivityService
    {
        private readonly IVolunteerActivityRepository _volunteerActivityRepository;
        public VolunteerActivityService(IVolunteerActivityRepository volunteerActivityRepository) => _volunteerActivityRepository = volunteerActivityRepository;

        public async Task<AddVolunteerActivityResponse> AddVolunteerActivityAsync(VolunteerActivity t) => await _volunteerActivityRepository.AddVolunteerActivityAsync(t);

        public async Task<GetAvailableVolunteerActivityResponse> AvailableVolunteerActivities(bool isDeleted, string volunteerActivityName, int tenantId) => await _volunteerActivityRepository.AvailableVolunteerActivities(isDeleted, volunteerActivityName, tenantId);

        public async Task<bool> DeleteAsync(int id) => await _volunteerActivityRepository.DeleteAsync(id);

        public async Task<List<VolunteerActivity>> GetAllAsync() => await _volunteerActivityRepository.GetAllAsync();

        public async Task<GetVolunteerActivityResponse> GetAllVolunteerActivitiesAsync(bool isDeleted, int tenantId) => await _volunteerActivityRepository.GetAllVolunteerActivitiesAsync(isDeleted, tenantId);

        public async Task<VolunteerActivity> GetByIdAsync(int id) => await _volunteerActivityRepository.GetByIdAsync(id);

        public async Task<UpdateVolunteerActivityResponse> UpdateVolunteerActivity(VolunteerActivity t) => await _volunteerActivityRepository.UpdateVolunteerActivityAsync(t);

        public async Task<DeleteVolunteerActivityResponse> UpdateVolunteerActivityByDeletedAsync(int id, bool isDeleted) => await _volunteerActivityRepository.UpdateVolunteerActivityByDeletedAsync(id, isDeleted);
    }
}
