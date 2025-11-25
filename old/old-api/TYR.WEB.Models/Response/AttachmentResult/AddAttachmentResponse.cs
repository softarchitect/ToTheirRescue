using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class AddAttachmentResponse : BaseOperationResult
    {
        public AddAttachmentData Data { get; set; }
    }
    public class AddAttachmentData
    {
        public int Id { get; set; }
        public ArtifactAttachment Attachment { get; set; }
    }
}
