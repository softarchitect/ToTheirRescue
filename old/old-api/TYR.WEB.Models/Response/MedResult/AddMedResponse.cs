using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedResult
{
    public class AddMedResponse: BaseOperationResult
    {
        public AddMedData Data { get; set; }
    }

    public class AddMedData
    {
        public List<Med> Meds { get; set; }
    }

    public class AddMedListResponse : BaseOperationResult
    {
        public List<AddMedListData> Data { get; set; }
    }

    public class AddMedListData
    {
        public int AnimalId { get; set; }
        public List<Med> Meds { get; set; }
    }
}
