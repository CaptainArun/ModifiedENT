using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class HospitalizationHistory
    {
        [Key]
        public int HospitalizationID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string AdmissionType { get; set; }
        public string InitialAdmissionStatus { get; set; }
        public string FacilityName { get; set; }
        public string AdmittingPhysician { get; set; }
        public string AttendingPhysician { get; set; }
        public string ChiefComplaint { get; set; }
        public string PrimaryDiagnosis { get; set; }
        public string ICDCode { get; set; }
        public string ProcedureType { get; set; }
        public string PrimaryProcedure { get; set; }
        public string CPTCode { get; set; }
        public string ProblemStatus { get; set; }
        public DateTime DischargeDate { get; set; }
        public string DischargeStatusCode { get; set; }
        public string AdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
