using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthNoteResult
{
    public class GetHealthNoteResponse: BaseOperationResult
    {
        public GetHealthNoteData Data { get; set; }
    }
    public class GetHealthNoteData
    {
        public List<HealthNoteCustom> HealthNotes { get; set; }
    }
        
    public class HealthNoteCustom
    {
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        public string Note { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }
        public DateTime? ActionDate { get; set; }
        public DateTime? DateEntered { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
