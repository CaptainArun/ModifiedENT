using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderTreatmentCode
    {
        [Key]
        public int ProviderTreatmentCodeID { get; set; }
        public int ProviderID { get; set; }
        public int TreatmentCodeID { get; set; }
        public string CPTCode { get; set; }
        public Boolean Deleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
