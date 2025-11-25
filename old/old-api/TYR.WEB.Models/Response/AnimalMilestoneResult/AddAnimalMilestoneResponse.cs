using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class AddAnimalMilestoneResponse : BaseOperationResult
    {
        public AddAnimalMilestoneData Data { get; set; }
    }

    public class AddAnimalMilestoneData
    {
        public int Id { get; set; }
        public AnimalMilestone AnimalMilestone { get; set; }
    }
    public class AddAnimalMilestoneListResponse : BaseOperationResult
    {
        public List<AddAnimalMilestoneResponse> ListData { get; set; }
    }
}
