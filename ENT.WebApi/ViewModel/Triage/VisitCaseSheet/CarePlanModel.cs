using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class CarePlanModel
    {
        #region entity properties
        public int CarePlanId { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string PlanningActivity { get; set; }
        public string Duration { get; set; }
        public Nullable<DateTime> StartDate { get; set; }
        public Nullable<DateTime> EndDate { get; set; }
        public string CarePlanStatus { get; set; }
        public string Progress { get; set; }
        public Nullable<DateTime> NextVisitDate { get; set; }
        public string AdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
        public int CaseSheetID { get; set; }
        public int ProviderId { get; set; }
        public int PatientId { get; set; }
        public string signOffstatus { get; set; }
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
