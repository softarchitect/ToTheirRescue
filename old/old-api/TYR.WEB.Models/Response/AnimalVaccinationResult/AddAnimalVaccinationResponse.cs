using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;

namespace TYR.WEB.Models.Response.AnimalVaccinationResult
{
    /// <summary>
    /// AddAnimalVaccinationResponse
    /// </summary>
    public class AddAnimalVaccinationResponse : BaseOperationResult
    {
        public AddAnimalVaccinationData Data { get; set; }
    }
    public class AddAnimalVaccinationData
    {
        public List<AnimalVaccination> AnimalVaccinations { get; set; }
    }

    /// <summary>
    /// AddAnimalVaccinationListResponse
    /// </summary>
    public class AddAnimalVaccinationListResponse : BaseOperationResult
    {
        public List<AnimalVaccinationListData> Data { get; set; }
    }

    public class AnimalVaccinationListData
    {
        public int AnimalId { get; set; }
        public List<AnimalVaccination> AnimalVaccinations { get; set; }
    }
}
