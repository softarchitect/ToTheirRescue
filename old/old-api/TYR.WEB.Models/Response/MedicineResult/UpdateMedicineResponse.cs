using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedicineResult
{
    public class UpdateMedicineResponse : BaseOperationResult
    {
        public UpdateMedicineData Data { get; set; }
    }

    public class UpdateMedicineData
    {
        public int Id { get; set; }
        public Medicine Medicine { get; set; }
    }
}
