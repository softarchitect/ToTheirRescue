using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TYR.WEB.DataAccess.Entities;
using TYR.WEB.Models.Common;
using TYR.WEB.Models.Response.AnimalMilestoneResult;

namespace TYR.WEB.Models.Response.AnimalProcedureResult
{
    /// <summary>
    /// AddAnimalProcedureResponse
    /// </summary>
    public class AddAnimalProcedureResponse: BaseOperationResult
    {
        public AddAnimalProcedureData Data { get; set; }
    }
    public class AddAnimalProcedureData
    {
        //public int Id { get; set; }
        public List<AnimalProcedure> AnimalProcedures { get; set; }
    }

    /// <summary>
    /// AddAnimalProcedureListResponse
    /// </summary>
    public class AddAnimalProcedureListResponse : BaseOperationResult
    {
        public List<AnimalProcedureListData> Data { get; set; }
    }

    public class AnimalProcedureListData
    {
        public int AnimalId { get; set; }
        public List<AnimalProcedure> AnimalProcedures { get; set; }
        //public AnimalProcedure AnimalProcedure { get; set; }
    }
}
