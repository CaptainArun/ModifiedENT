using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class VisitPaymentDetails
    {
        [Key]
        public int VisitPaymentDetailsID { get; set; }
        public int VisitPaymentID { get; set; }
        public int SetupMasterID { get; set; }
        public decimal Charges { get; set; }
        public Nullable<decimal> Refund { get; set; }
        public string RefundNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
