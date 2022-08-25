using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.ViewModel
{
    public class DiagnosisModel
    {
        #region entity properties
        public int DiagnosisId { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string ChiefComplaint { get; set; }
        public string ProblemAreaID { get; set; }
        public string ProblemDuration { get; set; }
        public string PreviousHistory { get; set; }
        public string SymptomsID { get; set; }
        public string OtherSymptoms { get; set; }
        public int PainScale { get; set; }
        public string PainNotes { get; set; }
        public string Timings { get; set; }
        public string ProblemTypeID { get; set; }
        public string AggravatedBy { get; set; }
        public string Alleviatedby { get; set; }
        public string ProblemStatus { get; set; }
        public string Observationotes { get; set; }
        public string InteractionSummary { get; set; }
        public string PAdditionalNotes { get; set; }
        public string Prognosis { get; set; }
        public string AssessmentNotes { get; set; }
        public string DiagnosisNotes { get; set; }
        public string ICD10 { get; set; }
        public string Etiology { get; set; }
        public string DAdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
        public string RecordedTime { get; set; }
        public string ProblemAreaValues { get; set; }
        public List<int> ProblemAreaArray { get; set; }
        public string SymptomsValues { get; set; }
        public List<int> SymptomsValueArray { get; set; }
        public string ProblemTypeValues { get; set; }
        public List<int> ProblemTypeArray { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }
        public string signOffstatus { get; set; }
        public string PainScaleDesc { get; set; }
        public List<clsViewFile> filePath { get; set; }
        public List<string> imageSet { get; set; }
        #endregion
    }
}
