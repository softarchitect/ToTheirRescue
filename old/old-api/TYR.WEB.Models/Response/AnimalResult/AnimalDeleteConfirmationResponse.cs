using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalResult
{
    public class AnimalDeleteConfirmationResponse : BaseOperationResult
    {
        public  Dictionary<string, int> Data { get; set; }

    }
    
}
