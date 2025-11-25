using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalBehaviorResult
{
    public class AddAnimalBehaviorResponse : BaseOperationResult
    {
        public AddAnimalBehaviorData Data { get; set; }
    }

    public class AddAnimalBehaviorData
    {
        public List<AnimalBehavior> AnimalBehaviors { get; set; }
    }

    public class AnimalBehaviorListResponse: BaseOperationResult
    {
        public List<AnimalBehaviorListData> Data { get; set; }
    }

    public class AnimalBehaviorListData
    {
        public int AnimalId { get; set; }
        public List<AnimalBehavior> AnimalBehaviors { get; set; }
    }
}
