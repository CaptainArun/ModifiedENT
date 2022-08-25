using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderDiagnosisCode
    {
        [Key]
        public int ProviderDiagnosisCodeID { get; set; }
        public int ProviderID { get; set; }
        public int DiagnosisCodeID { get; set; }
        public string ICDCode { get; set; }
        public Boolean Deleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
