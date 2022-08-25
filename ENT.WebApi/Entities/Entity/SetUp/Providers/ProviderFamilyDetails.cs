using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class ProviderFamilyDetails
    {
        [Key]
        public int ProviderFamilyDetailId { get; set; }
        public int ProviderID { get; set; }
        public string FullName { get; set; }
        public Nullable<int> Age { get; set; }
        public string RelationShip { get; set; }
        public string Occupation { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
