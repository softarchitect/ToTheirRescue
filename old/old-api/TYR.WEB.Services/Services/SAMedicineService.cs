using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SAMedicineResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SAMedicineService : ISAMedicineService
    {
        private readonly ISAMedicineRepository _saMedicineRepository;
        public SAMedicineService(ISAMedicineRepository saMedicineRepository) => _saMedicineRepository = saMedicineRepository;
        public async Task<AddSAMedicineResponse> AddSAMedicineAsync(SAMedicine t)
            => await _saMedicineRepository.AddSAMedicineAsync(t);

        public async Task<GetAvailableSAMedicineResponse> AvailableSAMedicinesAsync(bool isDeleted, string medicineName)
            => await _saMedicineRepository.AvailableSAMedicinesAsync(isDeleted, medicineName);

        public async Task<bool> DeleteAsync(int id) => await _saMedicineRepository.DeleteAsync(id);

        public async Task<List<SAMedicine>> GetAllAsync() => await _saMedicineRepository.GetAllAsync();

        public async Task<GetSAMedicineResponse> GetAllSAMedicinesAsync(bool isDeleted) 
            => await _saMedicineRepository.GetAllSAMedicinesAsync(isDeleted);

        public async Task<SAMedicine> GetByIdAsync(int id) => await _saMedicineRepository.GetByIdAsync(id);

        public async Task<UpdateSAMedicineResponse> UpdateSAMedicineAsync(SAMedicine t)
            => await _saMedicineRepository.UpdateSAMedicineAsync(t);

        public async Task<DeleteSAMedicineResponse> UpdateSAMedicineByDeletedAsync(int id, bool isDeleted)
            => await _saMedicineRepository.UpdateSAMedicineByDeletedAsync(id, isDeleted);
    }
}
