using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthHisotryResult
{
    public class GetHealthHistoryResponse: BaseOperationResult
    {
        public GetHealthHistoryData Data { get; set; }
    }

    public class GetHealthHistoryData
    {
        // ActionDate 
        // Kind - The Kind column will contain the kind of vaccination or procedure.   The Kind column will be blank for Note.
        // Clinic - I think Clinic will be there for Procedures and Vaccinations but not for Notes
        // Note - Note column will always have something in Notes but may be blank for Vaccinations and Procedures

        // Date
        // Type - Vaccination, Procedure, Note
        // Kind
        // Clinic
        // Notes
        public List<HealthHistory> HealthHistories { get; set; }
    }

    public class HealthHistory
    {
        public int? AnimalId { get; set; }
        public DateTime? ActionDate { get; set; }
        public string Type { get; set; }
        public string Kind { get; set; }
        public string Clinic { get; set; }
        public string Notes { get; set; }
        public int? TenantId { get; set; }
        public bool IsDeleted { get; set; }
    }
}
