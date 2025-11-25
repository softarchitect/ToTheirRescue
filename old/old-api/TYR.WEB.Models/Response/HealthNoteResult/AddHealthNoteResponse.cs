using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.HealthNoteResult
{
    public class AddHealthNoteResponse: BaseOperationResult
    {
        public AddHealthNoteData Data { get; set; }
    }

    public class AddHealthNoteData
    {
        public int Id { get; set; }
        public HealthNote HealthNote { get; set; }
    }
}
