using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientCategory
    {
        [Key]
        public int PatientCategoryID { get; set; }
        public string PatientCategoryCode { get; set; }
        public string PatientCategoryDesc { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
