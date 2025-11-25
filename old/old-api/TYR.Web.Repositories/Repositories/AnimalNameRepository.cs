using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Paging;

namespace TYR.Web.Repositories.Repositories
{
    public class AnimalNameRepository : RepositoryBase<AnimalName>, IAnimalNameRepository
    {
        private readonly TYRDbContext _dbContext;
        public AnimalNameRepository(TYRDbContext dbContext) : base(dbContext) { _dbContext = dbContext; }
        public async Task<AnimalName> AddAnimalNameAsync(AnimalName t)
        {
            _ = await base.AddAsync(t);
            return t;
        }

        public async Task<string> GetAnimalNameSuggestion(string gender)
        {
            List<AnimalName> _animalList = new();
            if (gender.ToLower().Trim() == "male" || gender.ToLower().Trim() == "female")
            {
                _animalList = await FindAllAsync(a => a.Sex.Equals(gender) || a.Sex.Equals("All"));
            }
            else
            {
                _animalList = await FindAllAsync(a => a.Sex.Equals(gender) || a.Sex.Equals("Any"));
            }
            int total = _animalList.Count();
            Random r = new Random();
            int offset = r.Next(0, total);
            return _animalList[offset].Name;
        }
    }
}
  