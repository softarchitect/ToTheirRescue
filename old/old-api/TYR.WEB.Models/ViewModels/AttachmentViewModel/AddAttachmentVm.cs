using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Models.ViewModels.AttachmentViewModel
{
    public class AddAttachmentVm
    {
        public string Entity { get; set; }

        public string AttachmentType { get; set; }

        public DateTime AttachmentDate { get; set; }

        public string Description { get; set; }

        public int PublicityRank { get; set; } 

        public string Notes { get; set; }

        public int? PcoId { get; set; }

        public int? AnimalId { get; set; }

        public int? TenantId { get; set; }

        public IFormFile Imagefiles { get; set; }
    }
}
