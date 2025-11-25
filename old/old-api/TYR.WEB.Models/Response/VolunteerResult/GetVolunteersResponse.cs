using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.VolunteerResult
{
    public class GetVolunteersResponse: BaseOperationResult
    {
        public GetVolunteersData Data { get; set; }
    }

    public class GetVolunteersData
    {
        public VolunteerPersonCustom VolunteerPersonCustom { get; set; }
    }

    public class VolunteerPersonCustom
    {
        public int VolunteerId { get; set; }
        public int VolunteerPersonActivityId { get; set; }
        public DateTime? DateActive { get; set; }
        public DateTime? DateInactive { get; set; }
        public bool Active { get; set; }
        public string Notes { get; set; }
        public int PcoId { get; set; }
        public bool IsPcoDeleted { get; set; }
        public bool IsVolunteerDeleted { get; set; }
        public int TenantId { get; set; }
        public List<VolunteerActivityCustom> VolunteerActivityCustoms { get; set; }
    }

    public class VolunteerActivityCustom
    {
        public int PcoId { get; set; }
        public int VolunteerActivityId { get; set; }
        public string VolunteerActivityName { get; set; }
        public int TenantId { get; set; }
        public bool IsPcoDeleted { get; set; }
    }
}
