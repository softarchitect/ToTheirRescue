using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SearchResult;
using TYR.WEB.Models.ViewModels.AnimalMilestoneViewModel;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISearchRepository: IRepositoryBase<AnimalMilestone>
    {
          //      -- AnimalMilestones.MilestoneType || MilestoneType 
          //-- AnimalMilestones.AcquisitionWayName, AcquisitionWay.Id, 
          //-- AnimalMilestones.OtherRescueIDNo
          //-- Animals.AnimalTypeName = 'Cats'
          //-- PCOs.LastName As OtherRescue || AND PCOs.Id = 423
          //-- AnimalMilestones.Notes like '%t%'
        Task<GetAnimalMilestoneSearchResponse> GetAnimalMilestoneSearchAsync(string milestoneType, int acquisitionWayId, int animalTypeId, string otherRescueIdNo, int pcoId, string note, int tenantId);
    }
}
