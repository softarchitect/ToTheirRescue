using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SABehaviorResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISABehaviorRepository : IRepositoryBase<SABehavior>
    {
        Task<AddSABehaviorResponse> AddSABehaviorAsync(SABehavior t);
        Task<DeleteSABehaviorResponse> UpdateSABehaviorByDeletedAsync(int id, bool isDeleted);
        Task<GetAllSABehaviorResponse> GetAllSABehaviorsAsync(bool isDeleted);
        Task<GetAllSABehaviorResponse> GetAllSABehaviorsAnimalTypeIdAsync(bool isDeleted, int saAnimalTypeId);
        Task<GetAvailableSABehaviorResponse> AvailableSABehavior(bool isDeleted, string saBehavior, int saAnimaltypeId);
        Task<UpdateSABehaviorResponse> UpdateSABehaviorAsync(SABehavior t);
    }
}
