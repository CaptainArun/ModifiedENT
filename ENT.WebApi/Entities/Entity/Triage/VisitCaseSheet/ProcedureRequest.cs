using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProcedureRequest
    {
        [Key]
		public int ProcedureRequestId { get; set; }
		public int VisitID { get; set; }
		public DateTime ProcedureRequestedDate { get; set; }
		public int ProcedureType { get; set; }
		public int AdmittingPhysician { get; set; }
		public string ApproximateDuration { get; set; }
		public int UrgencyID { get; set; }
		public string PreProcedureDiagnosis { get; set; }
		public string ICDCode { get; set; }
		public string PlannedProcedure { get; set; }
		public Nullable<int> ProcedureName { get; set; }
		public string CPTCode { get; set; }
		public Nullable<bool> AnesthesiaFitnessRequired { get; set; }
		public string AnesthesiaFitnessRequiredDesc { get; set; }
		public Nullable<bool> BloodRequired { get; set; }
		public string BloodRequiredDesc { get; set; }
		public Nullable<bool> ContinueMedication { get; set; }
		public Nullable<bool> StopMedication { get; set; }
		public Nullable<bool> SpecialPreparation { get; set; }
		public string SpecialPreparationNotes { get; set; }
		public Nullable<bool> DietInstructions { get; set; }
		public string DietInstructionsNotes { get; set; }
		public Nullable<bool> OtherInstructions { get; set; }
		public string OtherInstructionsNotes { get; set; }
		public Nullable<bool> Cardiology { get; set; }
		public Nullable<bool> Nephrology { get; set; }
		public Nullable<bool> Neurology { get; set; }
		public Nullable<bool> OtherConsults { get; set; }
		public string OtherConsultsNotes { get; set; }
		public Nullable<int> AdmissionType { get; set; }
		public string PatientExpectedStay { get; set; }
		public string InstructionToPatient { get; set; }
		public string AdditionalInfo { get; set; }
		public string ProcedureRequestStatus { get; set; }
		public int AdmissionStatus { get; set; }
		public bool IsActive { get; set; }
		public DateTime Createddate { get; set; }
		public string CreatedBy { get; set; }
		public Nullable<DateTime> ModifiedDate { get; set; }
		public string ModifiedBy { get; set; }
	}
}
