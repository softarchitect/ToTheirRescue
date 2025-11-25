using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SearchResult
{
    public class GetAnimalMilestoneSearchResponse: BaseOperationResult
    {
        public GetAnimalMilestoneSearchData Data { get; set; }
    }

    public class GetAnimalMilestoneSearchData
    {
        public int Count { get; set; }
        public List<AnimalMilestoneSearch> AnimalMilestoneSearches { get; set; }
    }

    public class AnimalMilestoneSearch
    {
        public int Id { get; set; }
        public int AnimalId { get; set; }
        public int PcoId { get; set; }
        public int AcquisitionWayId { get; set; }
        public int AnimalTypeId { get; set; }
        public int TenantId { get; set; }
        public DateTime? MilestoneDate { get; set; }
        public string AnimalName { get; set; }
        public string AnimalTypeName { get; set; }
        public string MilestoneType { get; set; }
        public string OtherRescue { get; set; }
        public string OtherRescueIdNo { get; set; }
        public string HowAcquired { get; set; } // AcquisitionWayName // HowAcquired
        public string Notes { get; set; }
        public bool AnimalMilestoneDeleted { get; set; }
        public bool AnimalDeleted { get; set; }
        public bool PcoDeleted { get; set; }
        public bool AcquisitionWayDeleted { get; set; }
    }
}
