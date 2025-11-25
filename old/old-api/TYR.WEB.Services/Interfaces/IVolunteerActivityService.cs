using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IVolunteerActivityService
    {
        Task<List<VolunteerActivity>> GetAllAsync();
        Task<VolunteerActivity> GetByIdAsync(int id);
        Task<AddVolunteerActivityResponse> AddVolunteerActivityAsync(VolunteerActivity t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteVolunteerActivityResponse> UpdateVolunteerActivityByDeletedAsync(int id, bool isDeleted);
        Task<GetVolunteerActivityResponse> GetAllVolunteerActivitiesAsync(bool isDeleted, int tenantId);
        Task<GetAvailableVolunteerActivityResponse> AvailableVolunteerActivities(bool isDeleted, string volunteerActivityName, int tenantId);
        Task<UpdateVolunteerActivityResponse> UpdateVolunteerActivity(VolunteerActivity t);
    }
}
