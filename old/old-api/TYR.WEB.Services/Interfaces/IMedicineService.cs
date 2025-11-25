using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IMedicineService
    {
        Task<List<Medicine>> GetAllAsync();
        Task<Medicine> GetByIdAsync(int id);
        Task<AddMedicineResponse> AddMedicineAsync(Medicine t);
        Task<bool> DeleteAsync(int id);
        Task<DeleteMedicineResponse> UpdateMedicineByDeletedAsync(int id, bool isDeleted);
        Task<GetMedicineResponse> GetAllMedicinesAsync(bool isDeleted, int tenantId);
        Task<GetAvailableMedicineResponse> AvailableMedicines(bool isDeleted, string medicineName, int tenantId);
        Task<UpdateMedicineResponse> UpdateMedicine(Medicine t);
    }
}
