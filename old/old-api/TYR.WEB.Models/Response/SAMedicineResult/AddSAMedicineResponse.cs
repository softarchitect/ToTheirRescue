using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAMedicineResult
{
    public class AddSAMedicineResponse: BaseOperationResult
    {
        public AddSAMedicineData Data { get; set; }
    }
    public class AddSAMedicineData
    {
        public int Id { get; set; }
    }
}
