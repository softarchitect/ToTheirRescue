using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalBehaviorResult
{
    public class GetAllAnimalBehaviorsResponse : BaseOperationResult
    {
        public GetAnimalBehaviorsData Data { get; set; }
    }

    public class GetAnimalBehaviorsData
    {
        //public List<AnimalBehavior> AnimalBehaviors { get; set; }
        public List<AnimalBehaviorCustom> AnimalBehaviors { get; set; }
    }

    public class AnimalBehaviorCustom
    {
        public int Id { get; set; }
        public int? BehaviorId { get; set; }
        public string BehaviorName { get; set; }
        public int? AnimalId { get; set; }
        public bool YesOrNo { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime? DateEntered { get; set; } = DateTime.Now;
        public DateTime? DateModified { get; set; } = DateTime.Now;
        public string EnteredBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }
    }
}
