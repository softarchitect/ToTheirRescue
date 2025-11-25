using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TYR.WEB.Services.Interfaces
{
    public interface IBlobsContainerService
    {
        Task<bool> UploadToBlob(string filepath);
    }
}
