using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class EmployeeCampus
    {
        [Key]
        public int EmployeeCampusId { get; set; }
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public Nullable<DateTime> CampusDate { get; set; }
        public string Details { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
