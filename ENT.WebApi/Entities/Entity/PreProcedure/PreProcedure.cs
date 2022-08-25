using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PreProcedure
    {
        [Key]
        public int PreProcedureID { get; set; }
        public int AdmissionID { get; set; }
        public DateTime ProcedureDate { get; set; }
        public int ScheduleApprovedBy { get; set; }
        public string ProcedureStatus { get; set; }
        public string CancelReason { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
