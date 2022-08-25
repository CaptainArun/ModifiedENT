using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class eLabOrder
    {
        [Key]
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
    }
}
