using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class DischargeSummary
    {
        [Key]
        public int DischargeSummaryId { get; set; }
        public string RecommendedProcedure { get; set; }
        public string AdmissionNumber { get; set; }
        public Nullable<DateTime> AdmissionDate { get; set; }
        public string AdmittingPhysician { get; set; }
        public string PreProcedureDiagnosis { get; set; }
        public string PlannedProcedure { get; set; }
        public string Urgency { get; set; }
        public string AnesthesiaFitnessNotes { get; set; }
        public string OtherConsults { get; set; }
        public string PostOperativeDiagnosis { get; set; }
        public string BloodLossInfo { get; set; }
        public string Specimens { get; set; }
        public string PainLevelNotes { get; set; }
        public string Complications { get; set; }
        public string ProcedureNotes { get; set; }
        public string AdditionalInfo { get; set; }
        public Nullable<DateTime> FollowUpDate { get; set; }
        public string FollowUpDetails { get; set; }
        public bool SignOff { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public string SignOffBy { get; set; }
        public string DischargeStatus { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
