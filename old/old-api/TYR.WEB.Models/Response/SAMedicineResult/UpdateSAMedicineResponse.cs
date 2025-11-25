using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAMedicineResult
{
    public class UpdateSAMedicineResponse: BaseOperationResult
    {
        public UpdateSAMedicineData Data { get; set; }
    }
    public class UpdateSAMedicineData
    {
        public int Id { get; set; }
        public SAMedicine SAMedicine { get; set; }
    }
}
