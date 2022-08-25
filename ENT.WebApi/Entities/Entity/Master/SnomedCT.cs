using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class SnomedCT
    {
        [Key]
        public int SnomedCTID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string VocabularyIDValue { get; set; }
        public string ConceptLevel { get; set; }
        public string ConceptClassActual { get; set; }
        public string ConceptClassAltered { get; set; }
        public Nullable<DateTime> EffectiveDate{ get; set; }
        public Nullable<DateTime> TerminationDate { get; set; }
        public bool Deleted{ get; set; }
        public DateTime CreatedDate{ get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string CodeSystem { get; set; }
    }
}
