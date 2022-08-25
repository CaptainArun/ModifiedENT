using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class TriageCountModel
    {
        public int TotalVisitCount { get; set; }
        public int TriageCompletedCount { get; set; }
        public int TriageWaitingCount { get; set; }
    }
}
