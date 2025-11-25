using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DiaryResult
{
    public class GetDiaryResponse : BaseOperationResult
    {
        public GetDiaryData Data { get; set; }
    }

    public class GetDiaryData
    {
       public List<DiaryCustom> Diaries { get; set; }
    }

    public class DiaryCustom
    {
        public int Id { get; set; }
        public int? AnimalId { get; set; }
        public string TenantOrAnimal { get; set; } // TenantOrAnimal – this identifies if the entry is for an animal or the tenant  - nvarchar(6), not null – allowable values are ‘tenant’ and ‘animal’
        public DateTime? ActionDate { get; set; }
        public string Notes { get; set; }
        public bool IsDeleted { get; set; }
        public int? TenantId { get; set; }
        
    }
}
