using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabOrderStatusModel
    {
        #region entity properties

        public int eLabOrderStatusId { get; set; }
        public int eLabOrderId { get; set; }
        public DateTime SampleCollectedDate { get; set; }
        public DateTime ReportDate { get; set; }
        public string ReportStatus { get; set; }
        public int ApprovedBy { get; set; }
        public string SignOffBy { get; set; }
        public Nullable<bool> SignOffStatus { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public string Notes { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public List<eLabOrderItemsModel> itemsModel { get; set; }
        public string ApprovedbyPhysician { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public List<clsViewFile> filePath { get; set; }

        #endregion
    }
}
