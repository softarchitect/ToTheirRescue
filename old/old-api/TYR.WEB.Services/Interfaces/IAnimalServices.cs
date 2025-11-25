using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Response.AnimalResult;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalService
    {
        Task<AddAnimalResponse> AddAnimalAsync(Animal animal);
        Task<AnimalPagedResponse> GetAnimalSearchFilterPagedAsync(int tenantId, bool isDeleted, string searchText, bool isCurrentResident, int limit, int page);
        Task<UpdateAnimalResponse> UpdateAnimalAsync(Animal animal, int id, string updatedBy);
        Task<DeleteAnimalResponse> DeleteAnimalAsync(int id, string updatedBy);
        Task<Animal> GetAnimalByIdAsync(int Id);
        Task<AnimalSearchAutoCompleteListResponse> AnimalSearchAutoCompleteAsync(int tenantId, string searchText, int limit);
        Task<int> GetLastAnimalIdAsync(int tenantId);
        Task<AnimalCountResponse> GetAnimalCountAsync(int tenantId);
        //Task<GetAnimalResponse> GetAnimalById(int animalId);
        Task<GetAnimalListResponse> GetAnimalListByIdsAsync(List<int> animalIds);
        Task<UpdateAnimalLocationResponse> UpdateAnimalLocationAsync(List<int> animalIds, string location);
        Task<UpdateAnimalPublicityBlurbResponse> UpdateAnimalPublicityBlurbAsync(int animalId, string publicityBlurb);
        Task<UpdateAnimalDietResponse> UpdateAnimalDietAsync(List<int> animalIds, string diet);
        Task<GetAnimalDietResponse> GetAnimalDietByIdAsync(int animalId);
        Task<GetAnimalPublicityBlurbResponse> GetAnimalPublicityBlurbByIdAsync(int animalId);

    }
}
