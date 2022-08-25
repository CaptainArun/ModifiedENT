using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabRequestModel
    {
        #region entity properties

        public int LabRequestID { get; set; }
        public int VisitID { get; set; }
        public int AdmissionID { get; set; }
        public Nullable<DateTime> RequestedDate { get; set; }
        public string RequestedBy { get; set; }
        public string LabOrderStatus { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public int patientId { get; set; }
        public string patientName { get; set; }
        public string facilityName { get; set; }
        public string RequestingPhysician { get; set; }
        public int providerId { get; set; }
        public int FacilityId { get; set; }
        public string AdmissionNo { get; set; }
        public string AdmissionDateandTime { get; set; }
        public string visitDateandTime { get; set; }
        public List<eLabRequestItemsModel> labRequestItems { get; set; }
        
        #endregion
    }
}
