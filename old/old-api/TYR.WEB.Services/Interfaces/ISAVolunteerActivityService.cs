using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAVolunteerActivityResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISAVolunteerActivityService
    {
        Task<List<SAVolunteerActivity>> GetAllAsync();
        Task<SAVolunteerActivity> GetByIdAsync(int id);
        Task<AddSAVolunteerActivityResponse> AddSAVolunteerActivityAsync(SAVolunteerActivity t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteSAVolunteerActivityResponse> UpdateSAVolunteerActivityByDeletedAsync(int id, bool isDeleted);
        Task<GetSAVolunteerActivityResponse> GetAllSAVolunteerActivitiesAsync(bool isDeleted);
        Task<GetAvailableSAVolunteerActivityResponse> AvailableSAVolunteerActivities(bool isDeleted, string saVolunteerActivityName);
        Task<UpdateSAVolunteerActivityResponse> UpdateSAVolunteerActivity(SAVolunteerActivity t);
    }
}
