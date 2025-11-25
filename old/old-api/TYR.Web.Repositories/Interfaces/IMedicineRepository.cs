using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IMedicineRepository : IRepositoryBase<Medicine>
    {
        Task<AddMedicineResponse> AddMedicineAsync(Medicine t);
        Task<DeleteMedicineResponse> UpdateMedicineByDeletedAsync(int id, bool isDeleted);
        Task<GetMedicineResponse> GetAllMedicinesAsync(bool isDeleted, int tenantId);
        Task<GetAvailableMedicineResponse> AvailableMedicines(bool isDeleted, string medicineName, int tenantId);
        Task<UpdateMedicineResponse> UpdateMedicineAsync(Medicine t);
    }
}
