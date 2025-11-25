using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedicineResult
{
    public class AddMedicineResponse : BaseOperationResult
    {
        public AddMedicineData Data { get; set; }
    }

    public class AddMedicineData
    {
        public int Id { get; set; }
    }
}
