using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PreProcedureModel
    {
        #region entity properties

        public int PreProcedureID { get; set; }
        public int AdmissionID { get; set; }
        public DateTime ProcedureDate { get; set; }
        public int ScheduleApprovedBy { get; set; }
        public string ProcedureStatus { get; set; }
        public string CancelReason { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties
        public AdmissionsModel admissionModel { get; set; }
        public int PatientId { get; set; }
        public int FacilityId { get; set; }
        public string AdmissionNo { get; set; }
        public string PatientName { get; set; }
        public string ProviderName { get; set; }
        public string facilityName { get; set; }
        public string AdmissionDateandTime { get; set; }
        public string urgencyType { get; set; }
        public string procedureNameDesc { get; set; }
        public bool AnesthesiaFitnessRequired { get; set; }
        #endregion
    }
}
