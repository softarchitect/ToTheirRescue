using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.ViewModels.PCO;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class PCODropDownResponse : BaseOperationResult
    {
        public List<PcoDropDownVM> Data { get; set; }
    }
    
}
