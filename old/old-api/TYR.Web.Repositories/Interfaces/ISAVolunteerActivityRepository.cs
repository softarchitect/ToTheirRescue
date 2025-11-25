using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVolunteerActivityResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISAVolunteerActivityRepository : IRepositoryBase<SAVolunteerActivity>
    {
        Task<AddSAVolunteerActivityResponse> AddSAVolunteerActivityAsync(SAVolunteerActivity t);
        Task<DeleteSAVolunteerActivityResponse> UpdateSAVolunteerActivityByDeletedAsync(int id, bool isDeleted);
        Task<GetSAVolunteerActivityResponse> GetAllSAVolunteerActivitiesAsync(bool isDeleted);
        Task<GetAvailableSAVolunteerActivityResponse> AvailableSAVolunteerActivities(bool isDeleted, string saVolunteerActivityName);
        Task<UpdateSAVolunteerActivityResponse> UpdateSAVolunteerActivityAsync(SAVolunteerActivity t);
    }
}
