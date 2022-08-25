using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.ViewModel
{
    public class HospitalizationHistoryModel
    {
        #region entity Properties
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

        #endregion

        #region custom properties

        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }
        public List<string> fileString { get; set; }
        public List<clsViewFile> filePath { get; set; }

        #endregion
    }
}
