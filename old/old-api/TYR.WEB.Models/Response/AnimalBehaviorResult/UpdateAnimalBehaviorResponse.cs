using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalBehaviorResult
{
    public class UpdateAnimalBehaviorResponse : BaseOperationResult
    {
        public UpdateAnimalBehaviorData Data { get; set; }
    }

    public class UpdateAnimalBehaviorData
    {
        public List<AnimalBehavior> AnimalBehaviors { get; set; }
    }
}
