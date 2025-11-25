using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.Web.Repositories.Interfaces
{
    public interface IAnimalNameRepository : IRepositoryBase<AnimalName>
    {
        Task<AnimalName> AddAnimalNameAsync(AnimalName t);
        Task<string> GetAnimalNameSuggestion(string gender);
    }
}
