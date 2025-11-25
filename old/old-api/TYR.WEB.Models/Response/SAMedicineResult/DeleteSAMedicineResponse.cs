using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.MedicineResult;

namespace TYR.WEB.Models.Response.SAMedicineResult
{
    public class DeleteSAMedicineResponse: BaseOperationResult
    {
        public DeleteSAMedicineData Data { get; set; }
    }
    public class DeleteSAMedicineData
    {
        public bool IsDeleted { get; set; }
    }
}
