using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalTypeResult;
using TYR.WEB.Models.Response.VolunteerPersonActivityResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IVolunteerPersonActivityRepository: IRepositoryBase<VolunteerPersonActivity>
    {
        Task<AddVolunteerPersonActivityResponse> AddVolunteerPersonActivityAsync(VolunteerPersonActivity t);
        Task<DeleteVolunteerPersonActivityResponse> UpdateVolunteerPersonActivityByDeletedAsync(int id, bool isDeleted);
        Task<GetVolunteerPersonActivityResponse> GetAllVolunteerPersonActivitiesAsync(bool isDeleted, int tenantId);
        Task<UpdateVolunteerPersonActivityResponse> UpdateVolunteerPersonActivityAsync(VolunteerPersonActivity t);
        Task<bool> UpdateVolunteerPersonActivitiesAsync(List<VolunteerPersonActivity> volunteerPersonActivities);
    }
}
