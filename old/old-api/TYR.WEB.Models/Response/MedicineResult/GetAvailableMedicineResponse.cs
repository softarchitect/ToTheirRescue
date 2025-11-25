using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.MedicineResult
{
    public class GetAvailableMedicineResponse : BaseOperationResult
    {
        public GetAvailableMedicinesData Data { get; set; }
    }

    public class GetAvailableMedicinesData
    {
        public bool IsAvailable { get; set; }
    }
}
