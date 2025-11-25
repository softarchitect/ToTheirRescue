using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class DeleteAttachmentResponse : BaseOperationResult
    {
        public DeleteAttachmentData Data { get; set; }
    }

    public class DeleteAttachmentData
    {
        public bool IsDeleted { get; set; }
    }
}
