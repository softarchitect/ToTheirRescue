using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalMilestoneResult
{
    public class DeleteAnimalMilestoneResponse : BaseOperationResult
    {
        public DeleteAnimalMilestoneData Data { get; set; }
    }

    public class DeleteAnimalMilestoneData
    {
        public bool IsDeleted { get; set; }
    }
}
