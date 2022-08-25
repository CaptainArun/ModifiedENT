using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class DischargeCountModel
    {
        public int TodayCompletedDischargeCount { get; set; }
        public int TodayPendingDischargeCount { get; set; }
    }
}
