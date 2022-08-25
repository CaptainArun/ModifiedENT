using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitPaymentDetailsModel
    {
        #region entity properties
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
        #endregion

        #region custom properties
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string billingParticular { get; set; }
        #endregion
    }
}
