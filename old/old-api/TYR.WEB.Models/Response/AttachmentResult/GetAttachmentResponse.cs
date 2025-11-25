using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AttachmentResult
{
    public class GetAttachmentResponse : BaseOperationResult
    {
        public GetAttachmentData Data { get; set; }
    }

    public class GetAttachmentData
    {
        public ArtifactAttachment ArtifactAttachment { get; set; }
    }
}
