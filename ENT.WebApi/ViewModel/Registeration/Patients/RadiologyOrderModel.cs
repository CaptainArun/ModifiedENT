using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class RadiologyOrderModel
    {
        #region entity properties
        public int RadiologyID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string OrderingPhysician { get; set; }
        public string NarrativeDiagnosis { get; set; }
        public string PrimaryICD { get; set; }
        public string RadiologyProcedure { get; set; }
        public string Type { get; set; }
        public string Section { get; set; }
        public string ContrastNotes { get; set; }
        public string PrimaryCPT { get; set; }
        public Nullable<DateTime> ProcedureRequestedDate { get; set; }
        public string InstructionsToPatient { get; set; }
        public string ProcedureStatus { get; set; }
        public Nullable<bool> ReferredLab { get; set; }
        public string ReferredLabValue { get; set; }
        public string ReportFormat { get; set; }
        public string AdditionalInfo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string ProcedureReqTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
