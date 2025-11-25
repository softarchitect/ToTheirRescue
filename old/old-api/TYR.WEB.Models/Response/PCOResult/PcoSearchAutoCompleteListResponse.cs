using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.PCOResult
{
    public class PcoSearchAutoCompleteListResponse : BaseOperationResult
    {
        public List<string> Data { get; set; }
    }
    

}
