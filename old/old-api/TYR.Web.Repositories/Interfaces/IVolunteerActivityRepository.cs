using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerActivityResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IVolunteerActivityRepository : IRepositoryBase<VolunteerActivity>
    {
        Task<AddVolunteerActivityResponse> AddVolunteerActivityAsync(VolunteerActivity t);
        Task<DeleteVolunteerActivityResponse> UpdateVolunteerActivityByDeletedAsync(int id, bool isDeleted);
        Task<GetVolunteerActivityResponse> GetAllVolunteerActivitiesAsync(bool isDeleted, int tenantId);
        Task<GetAvailableVolunteerActivityResponse> AvailableVolunteerActivities(bool isDeleted, string volunteerActivityName, int tenantId);
        Task<UpdateVolunteerActivityResponse> UpdateVolunteerActivityAsync(VolunteerActivity t);
    }
}
