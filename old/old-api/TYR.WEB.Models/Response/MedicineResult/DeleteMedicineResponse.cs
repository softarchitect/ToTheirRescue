using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedicineResult
{
    public class DeleteMedicineResponse : BaseOperationResult
    {
        public DeleteMedicineData Data { get; set; }
    }

    public class DeleteMedicineData
    {
        public bool IsDeleted { get; set; }
    }
}
