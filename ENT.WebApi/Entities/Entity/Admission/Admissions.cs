using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Admissions
    {
        [Key]
        public int AdmissionID { get; set; }
        public int FacilityID { get; set; }
        public int PatientID { get; set; }
        public int ProcedureRequestId { get; set; }
        public DateTime AdmissionDateTime { get; set; }
        public string AdmissionNo { get; set; }
        public string AdmissionOrigin { get; set; }
        public int AdmissionType { get; set; }
        public int AdmittingPhysician { get; set; }
        public int SpecialityID { get; set; }
        public string AdmittingReason { get; set; }
        public string PreProcedureDiagnosis { get; set; }
        public string ICDCode { get; set; }
        public int ProcedureType { get; set; }
        public string PlannedProcedure { get; set; }
        public Nullable<int> ProcedureName { get; set; }
        public string CPTCode { get; set; }
        public int UrgencyID { get; set; }
        public int PatientArrivalCondition { get; set; }
        public int PatientArrivalBy { get; set; }        
        public string PatientExpectedStay { get; set; }
        public Nullable<bool> AnesthesiaFitnessRequired { get; set; }
        public string AnesthesiaFitnessRequiredDesc { get; set; }
        public Nullable<bool> BloodRequired { get; set; }
        public string BloodRequiredDesc { get; set; }
        public Nullable<bool> ContinueMedication { get; set; }
        public int InitialAdmissionStatus { get; set; }
        public string InstructionToPatient { get; set; }
        public string AccompaniedBy { get; set; }
        public string WardAndBed { get; set; }
        public string AdditionalInfo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
