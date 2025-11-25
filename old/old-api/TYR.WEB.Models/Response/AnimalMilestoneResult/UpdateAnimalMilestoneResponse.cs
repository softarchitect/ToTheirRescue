using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class UpdateAnimalMilestoneResponse : BaseOperationResult
    {
        public UpdateAnimalMilestoneData Data { get; set; }
    }

    public class UpdateAnimalMilestoneData
    {
        public int Id { get; set; }
        public AnimalMilestone AnimalMilestone { get; set; }
    }
}
