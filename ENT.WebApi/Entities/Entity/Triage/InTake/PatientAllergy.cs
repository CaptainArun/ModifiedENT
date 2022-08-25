using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientAllergy
    {
        [Key]
        public int AllergyId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public int AllergyTypeID { get; set; }
        public string Name { get; set; }
        public string Allergydescription { get; set; }
        public string Aggravatedby { get; set; }
        public string Alleviatedby { get; set; }
        public Nullable<DateTime> Onsetdate { get; set; }
        public int AllergySeverityID { get; set; }
        public string Reaction { get; set; }
        public string Status { get; set; }
        public string ICD10 { get; set; }
        public string SNOMED { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
    }
}
