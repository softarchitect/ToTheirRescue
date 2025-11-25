using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalTypeResult;

namespace TYR.WEB.Models.Response.AnimalBehaviorResult
{
    public class DeleteAnimalBehaviorResponse : BaseOperationResult
    {
        public DeleteAnimalBehaviorData Data { get; set; }
    }

    public class DeleteAnimalBehaviorData
    {
        public bool IsDeleted { get; set; }
    }
}
