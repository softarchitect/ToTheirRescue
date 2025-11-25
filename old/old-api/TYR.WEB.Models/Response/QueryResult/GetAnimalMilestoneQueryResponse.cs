using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.QueryResult
{
    public class GetAnimalMilestoneQueryResponse: BaseOperationResult
    {
        public GetAnimalMilestoneQueryData Data { get; set; }
    }

    public class GetAnimalMilestoneQueryData
    {
        public int Count { get; set; }
        public List<AnimalMilestoneQuery> AnimalMilestoneQueries { get; set; }
        
    }

    public class AnimalMilestoneQuery
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public int PcoId { get; set; }
        public int TenantId { get; set; }
        public DateTime? MilestoneDate { get; set; }
        public string AnimalName { get; set; }
        public string AnimalTypeName { get; set; }
        public string MilestoneType { get; set; }
        public string OtherRescue { get; set; }
        public string HowAcquired { get; set; } // AcquisitionWayName // HowAcquired
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Notes { get; set; }
        public bool AnimalMilestoneDeleted { get; set; }
        public bool AnimalDeleted { get; set; }
        public bool PcoDeleted { get; set; }
    }
}
