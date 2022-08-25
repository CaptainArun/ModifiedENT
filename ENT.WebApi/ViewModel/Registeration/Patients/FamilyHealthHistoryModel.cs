using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class FamilyHealthHistoryModel
    {
        #region entity properties
        public int FamilyHealthHistoryID { get; set; }
        public int VisitID { get; set; }
        public string ICDCode { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string FamilyMemberName { get; set; }
        public int FamilyMemberAge { get; set; }
        public string Relationship { get; set; }
        public string DiagnosisNotes { get; set; }        
        public string IllnessType { get; set; }
        public string ProblemStatus { get; set; }
        public string PhysicianName { get; set; }
        public string AdditionalNotes { get; set; }
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
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
