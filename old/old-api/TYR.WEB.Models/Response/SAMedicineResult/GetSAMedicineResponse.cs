using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.SAMedicineResult
{
    public class GetSAMedicineResponse: BaseOperationResult
    {
        public GetSAMedicinesData Data { get; set; }
    }
    public class GetSAMedicinesData
    {
        public List<SAMedicine> Medicines { get; set; }
    }
}
