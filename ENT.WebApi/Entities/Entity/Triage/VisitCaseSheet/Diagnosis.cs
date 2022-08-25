using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class Diagnosis
    {
        [Key]
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
    }
}
