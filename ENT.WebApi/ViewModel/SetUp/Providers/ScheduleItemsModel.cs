using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ScheduleItemsModel
    {
        public string AppointmentDay { get; set; }
        public string RegularWorkHrsFrom { get; set; }
        public string RegularWorkHrsTo { get; set; }
        public string BreakHrsFrom1 { get; set; }
        public string BreakHrsTo1 { get; set; }
        public string BreakHrsFrom2 { get; set; }
        public string BreakHrsTo2 { get; set; }
        public Nullable<int> NoOfSlots { get; set; }
        public int BookingPerDay { get; set; }
    }
}
