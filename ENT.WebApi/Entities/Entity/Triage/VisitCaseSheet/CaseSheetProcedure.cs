using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class CaseSheetProcedure
    {
        [Key]
        public int procedureId { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string PrimaryCPT { get; set; }
        public string ChiefComplaint { get; set; }
        public string DiagnosisNotes { get; set; }
        public string PrimaryICD { get; set; }
        public string TreatmentType { get; set; }
        public string ProcedureNotes { get; set; }
        public string RequestedprocedureId { get; set; }
        public Nullable<DateTime> Proceduredate { get; set; }
        public string ProcedureStatus { get; set; }
        public Nullable<bool> IsReferred { get; set; }
        public string ReferralNotes { get; set; }
        public string FollowUpNotes { get; set; }
        public string AdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
