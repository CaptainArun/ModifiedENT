using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AdmissionCountModel
    {
        public int TodayAdmissionCount { get; set; }
        public int TodayProcedureRequestCount { get; set; }
        public int GeneralAdmissionCount { get; set; }
        public int EmergencyAdmissionCount { get; set; }
    }
}
