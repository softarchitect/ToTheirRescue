using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthNoteResult
{
    public class DeleteHealthNoteResponse: BaseOperationResult
    {
        public DeleteHealthNoteData Data { get; set; }
    }

    public class DeleteHealthNoteData
    {
        public bool IsDeleted { get; set; }
    }
}
