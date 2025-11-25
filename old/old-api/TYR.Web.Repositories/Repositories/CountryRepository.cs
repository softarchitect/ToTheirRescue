using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.Web.Repositories.Interfaces;
using TYR.WEB.DataAccess;
using TYR.WEB.DataAccess.Entities;

namespace TYR.Web.Repositories.Repositories
{
    public class CountryRepository: RepositoryBase<Country>, ICountryRepository
    {
        public CountryRepository(TYRDbContext dbContext) : base(dbContext) { }
    }
}
