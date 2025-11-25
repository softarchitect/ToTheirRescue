using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAMedicineResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface ISAMedicineService
    {
        Task<List<SAMedicine>> GetAllAsync();
        Task<SAMedicine> GetByIdAsync(int id);
        Task<AddSAMedicineResponse> AddSAMedicineAsync(SAMedicine t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteSAMedicineResponse> UpdateSAMedicineByDeletedAsync(int id, bool isDeleted);
        Task<GetSAMedicineResponse> GetAllSAMedicinesAsync(bool isDeleted);
        Task<GetAvailableSAMedicineResponse> AvailableSAMedicinesAsync(bool isDeleted, string medicineName);
        Task<UpdateSAMedicineResponse> UpdateSAMedicineAsync(SAMedicine t);
    }
}
