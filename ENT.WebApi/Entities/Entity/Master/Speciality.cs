using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Speciality
    {
        [Key]
        public int SpecialityID { get; set; }
        public Nullable<int> CategoryID { get; set; }
        public string SpecialityCode { get; set; }
        public string SpecialityDescription { get; set; }
        public Nullable<int> GroupID { get; set; }
        public Boolean Deleted { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
