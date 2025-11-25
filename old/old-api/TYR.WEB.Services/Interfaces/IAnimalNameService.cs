using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;

namespace TYR.WEB.Services.Interfaces
{
    public interface IAnimalNameService
    {
        Task<AnimalName> AddAnimalNameAsync(AnimalName t);
        Task<string> GetAnimalNameSuggestion(string gender);
    }
}
