using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.HealthHisotryResult;
using TYR.WEB.Models.Response.QueryResult;
using TYR.WEB.Models.ViewModels.TenantViewModel;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IQueryRepository: IRepositoryBase<AnimalMilestone>
    {
        //AnimalMilestones.MilestoneType = 'Intake'
        //  AND Animals.AnimalTypeName = 'Cats' 
        //  AND AnimalMilestones.MilestoneDate >= '2020-04-23' 
        //  AND AnimalMilestones.MilestoneDate <= '2024-11-23' 
        //  AND AnimalMilestones.TenantID = 2
        Task<GetAnimalMilestoneQueryResponse> GetAnimalMilestoneQueryAsync(string milestoneType, string animalTypeName, DateTime? milestoneStartDate, DateTime? milestoneEndDate, int tenantId);
    }
}
