using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.DiaryResult
{
    public class DeleteDiaryResponse: BaseOperationResult
    {
        public DeleteDiaryData Data { get; set; }
    }

    public class DeleteDiaryData
    {
        public bool IsDeleted { get; set; }
    }
}
