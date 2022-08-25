using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientVisitModel
    {
        #region entity properties
        public int VisitId { get; set; }
        public int AppointmentID { get; set; }
        public string VisitNo { get; set; }
        public DateTime VisitDate { get; set; }
        public string Visittime { get; set; }
        public int PatientId { get; set; }
        public Nullable<int> FacilityID { get; set; }
        public string VisitReason { get; set; }
        public string ToConsult { get; set; }
        public int ProviderID { get; set; }
        public string ReferringFacility { get; set; }
        public string ReferringProvider { get; set; }
        public string ConsultationType { get; set; }
        public string ChiefComplaint { get; set; }
        public string AccompaniedBy { get; set; }
        public string Appointment { get; set; }
        public string PatientNextConsultation { get; set; }
        public string TokenNumber { get; set; }
        public string AdditionalInformation { get; set; }
        public Nullable<Boolean> TransitionOfCarePatient { get; set; }
        public Nullable<Boolean> SkipVisitIntake { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public Nullable<int> PatientArrivalConditionID { get; set; }
        public Nullable<int> UrgencyTypeID { get; set; }
        public Nullable<int> VisitStatusID { get; set; }
        public Nullable<int> RecordedDuringID { get; set; }
        public Nullable<int> VisitTypeID { get; set; }
        #endregion

        #region Custom properties
        public string patientArrivalCondition { get; set; }
        public string urgencyType { get; set; }
        public string visitStatus { get; set; }
        public string recordedDuring { get; set; }
        public string visitType { get; set; }
        public string PatientName { get; set; }
        public string MRNumber { get; set; }
        public string PatientContactNumber { get; set; }
        public string ProviderName { get; set; }
        public string FacilityName { get; set; }
        public string ConsultStartTime { get; set; }
        public string ConsultEndTime { get; set; }
        public string VisitDateandTime { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedTime { get; set; }
        public decimal AmountPaid { get; set; }
        #endregion
    }
}
