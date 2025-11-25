using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Models.Response.SAMedicineResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface ISAMedicineRepository: IRepositoryBase<SAMedicine>
    {
        Task<AddSAMedicineResponse> AddSAMedicineAsync(SAMedicine t);
        Task<DeleteSAMedicineResponse> UpdateSAMedicineByDeletedAsync(int id, bool isDeleted);
        Task<GetSAMedicineResponse> GetAllSAMedicinesAsync(bool isDeleted);
        Task<GetAvailableSAMedicineResponse> AvailableSAMedicinesAsync(bool isDeleted, string medicineName);
        Task<UpdateSAMedicineResponse> UpdateSAMedicineAsync(SAMedicine t);
    }
}
