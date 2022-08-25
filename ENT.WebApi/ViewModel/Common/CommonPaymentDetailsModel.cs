using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class CommonPaymentDetailsModel
    {
        public int VisitPaymentID { get; set; }
        public int AdmissionPaymentID { get; set; }
        public int VisitPaymentDetailsID { get; set; }
        public int AdmissionPaymentDetailsID { get; set; }
        public int SetupMasterID { get; set; }
        public decimal Charges { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string billingParticular { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string ReceiptNo { get; set; }
        public string AdmissionNo { get; set; }
        public string VisitNo { get; set; }
        public DateTime ReceiptDate { get; set; }
        public string ReceiptTime{ get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AmountPaid { get; set; }
        public Nullable<decimal> Refund { get; set; }
        public string RefundNotes { get; set; }
        public string Notes { get; set; }
        public int FacilityID { get; set; }
        public string facilityName { get; set; }
    }
}
