using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SOAPResult
{
    public class GetSOAPResponse: BaseOperationResult
    {
        public GetSOAPData Data { get; set; }
    }

    public class GetSOAPData
    {
        public List<SOAPCustom> SOAPs { get; set; }
    }

    public class SOAPCustom
    {
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string SOAPPlan { get; set; }
        public int? HospitalClinicId { get; set; }
        public string Veterinarian { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }
    }
}
