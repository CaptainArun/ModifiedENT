using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitCountModel
    {
        public int AppointCount { get; set; }
        public int TotalVisitCount { get; set; }
        public int WalkinCount { get; set; }
        public int CompletedCount { get; set; }
    }
}
