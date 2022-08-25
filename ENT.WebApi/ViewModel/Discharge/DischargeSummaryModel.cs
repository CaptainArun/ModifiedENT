using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class DischargeSummaryModel
    {
        #region entity properties

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

        #endregion

        #region custom properties

        public int patientId { get; set; }
        public int FacilityId { get; set; }
        public int admissionId { get; set; }
        public string patientName { get; set; }
        public string procedureStatus { get; set; }
        public MedicationRequestsModel medicationRequest { get; set; }
        public eLabRequestModel elabRequest { get; set; }
        public List<clsViewFile> DischargeFile { get; set; }
        public string DischargeImage { get; set; }
        public string facilityName { get; set; }

        #endregion
    }
}
