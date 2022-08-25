using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class RadiologyProcedureRequested
    {
        [Key]
        public int RadiologyProcedureRequestedID { get; set; }
        public string RadiologyProcedureRequestedCode { get; set; }
        public string RadiologyProcedureRequestedDesc { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
