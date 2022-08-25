using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderScheduleModel
    {
        #region entity properties
        public int ProviderScheduleID { get; set; }
        public int FacilityID { get; set; }
        public int ProviderID { get; set; }
        public Nullable<DateTime> EffectiveDate { get; set; }
        public Nullable<DateTime> TerminationDate { get; set; }
        public int TimeSlotDuration { get; set; }
        public int BookingPerSlot { get; set; }
        public Boolean AppointmentAllowed { get; set; }
        public string AppointmentDay { get; set; }
        public string RegularWorkHrsFrom { get; set; }
        public string RegularWorkHrsTo { get; set; }
        public string BreakHrsFrom1 { get; set; }
        public string BreakHrsTo1 { get; set; }
        public string BreakHrsFrom2 { get; set; }
        public string BreakHrsTo2 { get; set; }
        public Nullable<int> NoOfSlots { get; set; }
        public int BookingPerDay { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region Custom properties
        public List<ScheduleItemsModel> Items { get; set; }
        public string ProviderName { get; set; }
        public string FacilityName { get; set; }
        public string TimeavailabilityStatus { get; set; }
        #endregion
    }
}
