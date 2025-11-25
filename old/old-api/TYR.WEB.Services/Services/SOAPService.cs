using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.SOAPResult;
using TYR.WEB.Services.Interfaces;

namespace TYR.WEB.Services.Services
{
    public class SOAPService : ISOAPService
    {
        private readonly ISOAPRepository _soapRepository;
        public SOAPService(ISOAPRepository soapRepository) => _soapRepository = soapRepository;
        public async Task<AddSOAPResponse> AddSOAPAsync(SOAP soap) => await _soapRepository.AddSOAPAsync(soap);

        public async Task<GetSOAPResponse> GetSOAPByAnimalIdAsync(int animalId, bool isDeleted, int tenantId)
            => await _soapRepository.GetSOAPByAnimalIdAsync(animalId, isDeleted, tenantId);

        public async Task<SOAP> GetSOAPByIdAsync(int id) => await _soapRepository.GetByIdAsync(id);

        public async Task<GetSOAPResponse> GetSOAPByTenantIdAsync(bool isDeleted, int tenantId)
            => await _soapRepository.GetSOAPByTenantIdAsync(isDeleted, tenantId);

        public async Task<UpdateSOAPResponse> UpdateSOAPAsync(int id, SOAP soap)
            => await _soapRepository.UpdateSOAPAsync(id, soap);

        public async Task<DeleteSOAPResponse> UpdateSOAPByDeletedAsync(int id, bool isDeleted)
            => await _soapRepository.UpdateSOAPByDeletedAsync(id, isDeleted);
    }
}
