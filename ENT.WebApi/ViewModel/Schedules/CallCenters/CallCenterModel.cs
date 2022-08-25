using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class CallCenterModel
    {
        #region entity properties 
        public int CallCenterId { get; set; }
        public int PatientId { get; set; }
        public int AppointmentID { get; set; }
        public int ProcedureReqID { get; set; }
        public string NumberCalled { get; set; }
        public string WhomAnswered { get; set; }
        public string CallStatus { get; set; }
        public string AppProcStatus { get; set; }
        public string MessagePassed { get; set; }
        public string AdditionalInformation { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties
        public string PatientName { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string AppointmentStatusDesc { get; set; }
        #endregion
    }
}
