using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AppointmentCountModel
    {
        public int totalCount { get; set; }
        public int ScheduledCount { get; set; }
        public int waitCount { get; set; }
        public int ConfirmedCount { get; set; }
        public int PendingAppointmentCount { get; set; }
        public int CancelledCount { get; set; }
        public int ReScheduledCount { get; set; }
        public int VisitConvertedAppointmentCount { get; set; }
    }
}
