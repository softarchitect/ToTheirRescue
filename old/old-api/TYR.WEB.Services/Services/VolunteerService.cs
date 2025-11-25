using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.VolunteerResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class VolunteerService: IVolunteerService
    {
        private readonly IVolunteerRepository _volunteerRepository;
        public VolunteerService(IVolunteerRepository volunteerRepository) => _volunteerRepository = volunteerRepository;

        public async Task<UpsertVolunteerResponse> UpsertVolunteerAsync(Volunteer t, List<VolunteerPersonActivity> volunteerPersonActivities) => await _volunteerRepository.UpsertVolunteerAsync(t, volunteerPersonActivities);

        public async Task<GetVolunteersResponse> GetVolunteersByPcoIdAsync(int pcoId, int tenantId) => await _volunteerRepository.GetVolunteersByPcoIdAsync(pcoId, tenantId);

        public async Task<UpdateVolunteerResponse> UpdateVolunteerAsync(int pcoId, Volunteer t, List<VolunteerPersonActivity> volunteerPersonActivities, int tenantId) 
                                                                        => await _volunteerRepository.UpdateVolunteerAsync(pcoId, t, volunteerPersonActivities, tenantId);
    }
}
