using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.MedicineResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly IMedicineRepository _medicineRepository;
        public MedicineService(IMedicineRepository medicineRepository) => _medicineRepository = medicineRepository;
        public async Task<AddMedicineResponse> AddMedicineAsync(Medicine t) => await _medicineRepository.AddMedicineAsync(t);

        public async Task<GetAvailableMedicineResponse> AvailableMedicines(bool isDeleted, string medicineName, int tenantId) => await _medicineRepository.AvailableMedicines(isDeleted, medicineName, tenantId);

        public async Task<bool> DeleteAsync(int id) => await _medicineRepository.DeleteAsync(id);

        public async Task<List<Medicine>> GetAllAsync() => await _medicineRepository.GetAllAsync();

        public async Task<GetMedicineResponse> GetAllMedicinesAsync(bool isDeleted, int tenantId) => await _medicineRepository.GetAllMedicinesAsync(isDeleted, tenantId);

        public async Task<Medicine> GetByIdAsync(int id) => await _medicineRepository.GetByIdAsync(id);

        public async Task<UpdateMedicineResponse> UpdateMedicine(Medicine t) => await _medicineRepository.UpdateMedicineAsync(t);

        public async Task<DeleteMedicineResponse> UpdateMedicineByDeletedAsync(int id, bool isDeleted) => await _medicineRepository.UpdateMedicineByDeletedAsync(id, isDeleted);
    }
}
