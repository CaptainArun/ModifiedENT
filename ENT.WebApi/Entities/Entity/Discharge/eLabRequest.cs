using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class eLabRequest
    {
        [Key]
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
    }
}
