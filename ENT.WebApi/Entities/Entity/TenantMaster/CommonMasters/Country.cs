using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Country
    {
        [Key]
        public int CountryId { get; set; }
        public string CountryCode { get; set; }
        public string CountryDescription { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
