using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class VisitPayment
    {
        [Key]
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
    }
}
