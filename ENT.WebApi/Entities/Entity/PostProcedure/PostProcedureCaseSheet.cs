using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PostProcedureCaseSheet
    {
        [Key]
        public int PostProcedureID { get; set; }
        public int PreProcedureID { get; set; }
        public DateTime RecordedDate { get; set; }
        public int RecordedDuring { get; set; }
        public string RecordedBy { get; set; }
        public DateTime ProcedureStartDate { get; set; }
        public DateTime ProcedureEndDate { get; set; }
        public int AttendingPhysician { get; set; }
        public string ProcedureNotes { get; set; }
        public int ProcedureName { get; set; }
        public string PrimaryCPT { get; set; }
        public string Specimens { get; set; }
        public string DiagnosisNotes { get; set; }
        public string Complications { get; set; }
        public string BloodLossTransfusion { get; set; }
        public string AdditionalInfo { get; set; }
        public string ProcedureStatus { get; set; }
        public string ProcedureStatusNotes { get; set; }
        public Nullable<int> PatientCondition { get; set; }
        public Nullable<int> PainLevel { get; set; }
        public string PainSleepMedication { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public string SignOffUser { get; set; }
        public bool SignOffStatus { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
