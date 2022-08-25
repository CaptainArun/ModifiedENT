using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class eLabOrderStatus
    {
        [Key]
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
    }
}
