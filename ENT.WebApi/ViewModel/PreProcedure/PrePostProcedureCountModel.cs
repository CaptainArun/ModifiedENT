using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PrePostProcedureCountModel
    {
        public int TotalRequestCount { get; set; }
        public int FitnessClearanceCount { get; set; }
        public int ScheduledCount { get; set; }
    }
}
