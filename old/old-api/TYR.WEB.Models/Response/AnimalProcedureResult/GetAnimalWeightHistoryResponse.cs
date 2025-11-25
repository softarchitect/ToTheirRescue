using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalProcedureResult
{
    public class GetAnimalWeightHistoryResponse : BaseOperationResult
    {
        public GetAnimalWeightHistoryData Data { get; set; }
    }

    public class GetAnimalWeightHistoryData
    {
        public List<AnimalWeightHistory> AnimalWeightHistory { get; set; }
    }

    public class AnimalWeightHistory
    {
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Weight { get; set; }
        public int? TenantId { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
