using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class GetAnimalMilestonesResponse : BaseOperationResult
    {
        public GetAnimalMilestoneData Data { get; set; }
    }
    public class GetAnimalMilestoneData
    {
        public int CurrentPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPage { get; set; }
        public bool NextPage { get; set; }
        public bool PrevPage { get; set; }
        public List<AnimalMilestone> AnimalMilestones { get; set; }
    }
}
