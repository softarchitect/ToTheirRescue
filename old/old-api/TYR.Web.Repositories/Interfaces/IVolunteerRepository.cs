using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerPersonActivityResult;
using TYR.WEB.Models.Response.VolunteerResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IVolunteerRepository: IRepositoryBase<Volunteer>
    {
        Task<UpsertVolunteerResponse> UpsertVolunteerAsync(Volunteer t, List<VolunteerPersonActivity> volunteerPersonActivities);
        Task<GetVolunteersResponse> GetVolunteersByPcoIdAsync(int pcoId, int tenantId);
        //Task<DeleteVolunteerResponse> UpdateVolunteerByDeletedAsync(int id, bool isDeleted);
        Task<UpdateVolunteerResponse> UpdateVolunteerAsync(int pcoId, Volunteer t, List<VolunteerPersonActivity> volunteerPersonActivities, int tenantId);
    }
}
