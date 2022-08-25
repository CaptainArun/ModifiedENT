using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitPaymentModel
    {
        #region entity properties

        public int VisitPaymentID { get; set; }
        public int VisitID { get; set; }
        public string ReceiptNo { get; set; }
        public DateTime ReceiptDate { get; set; }
        public string BillNo { get; set; }
        public decimal MiscAmount { get; set; }
        public string DiscountPercentage { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal NetAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string PaymentMode { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties
        public List<VisitPaymentDetailsModel> paymentDetailsItem { get; set; }
        public string VisitDateandTime { get; set; }
        public string PatientName { get; set; }
        public int PatientId { get; set; }
        public int FacilityId { get; set; }
        public string PatientContactNumber { get; set; }
        public string MRNumber { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        #endregion
    }
}
