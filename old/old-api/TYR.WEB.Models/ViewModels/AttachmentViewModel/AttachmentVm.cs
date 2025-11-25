using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AttachmentViewModel
{
    public class AttachmentVm
    {
        public string Entity { get; set; }

        public string AttachmentType { get; set; }

        public string FileName { get; set; }

        public string FileNameExtension { get; set; }

        public DateTime AttachmentDate { get; set; }

        public string Description { get; set; }

        public int PublicityRank { get; set; }

        public int SequenceNo { get; set; }

        public string Notes { get; set; }

        public string OriginalBlobUrl { get; set; }

        public string BlobUrl { get; set; }

        public string ThumbnailBlobUrl { get; set; }

        public int? PcoId { get; set; }
        public string Person { get; set; }

        public int AnimalId { get; set; }
        public string Animal { get; set; }

        public int? TenantId { get; set; }


    }
}
