using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class UpdatePCOResponse :  BaseOperationResult
    {
        public UpdatePcoData Data { get; set; }
    }
    public class UpdatePcoData
    {
        public int Id { get; set; }
        public PCO PCO { get; set; }
    }
}
