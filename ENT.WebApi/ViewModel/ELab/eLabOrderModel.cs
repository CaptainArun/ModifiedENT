using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabOrderModel
    {
        #region entity properties

        public int LabOrderID { get; set; }
        public string LabOrderNo { get; set; }
        public int VisitID { get; set; }
        public int AdmissionID { get; set; }
        public int LabPhysician { get; set; }
        public bool SignOff { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public string SignOffBy { get; set; }
        public string LabOrderStatus { get; set; }
        public string RequestedFrom { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public List<eLabOrderItemsModel> labOrderItems { get; set; }
        public eLabOrderStatusModel labOrderStatusReport { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int patientId { get; set; }
        public int ProviderId { get; set; }
        public int FacilityID { get; set; }
        public string patientName { get; set; }
        public string facilityName { get; set; }
        public string physicianName { get; set; }
        public string AdmissionNo { get; set; }
        public string VisitNo { get; set; }
        public string AdmissionDateandTime { get; set; }
        public string visitDateandTime { get; set; }
        public string ValidationStatus { get; set; }

        #endregion
    }
}
