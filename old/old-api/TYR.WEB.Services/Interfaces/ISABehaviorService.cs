using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.BehaviorResult;
using TYR.WEB.Models.Response.SABehaviorResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISABehaviorService
    {
        Task<List<SABehavior>> GetAllAsync();
        Task<SABehavior> GetByIdAsync(int id);
        Task<AddSABehaviorResponse> AddSABehaviorAsync(SABehavior t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteSABehaviorResponse> UpdateSABehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSABehaviorResponse> GetAllSABehaviorsAsync(bool isDeleted);
        Task<GetAllSABehaviorResponse> GetAllBehaviorsByAnimalTypeIdAsync(bool isDeleted, int animalTypeId);
        Task<GetAvailableSABehaviorResponse> AvailableSABehavior(bool isDeleted, string saBehavior, int saAnimaltypeId);
        Task<UpdateSABehaviorResponse> UpdateSABehaviorAsync(SABehavior t);
    }
}
