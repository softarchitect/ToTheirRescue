using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class AnimalMilestonesCountResponse : BaseOperationResult
    {
        public AnimalMilestoneCountData Data { get; set; }
    }

    public class AnimalMilestoneCountData
    {
        public int Count { get; set; }
        public List<AnimalMilestone> AnimalMilestones { get; set; }
    }
}
