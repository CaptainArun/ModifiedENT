using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class EmployeeHobbyInfo
    {
        [Key]
        public int EmployeeHobbyId { get; set; }
        public int EmployeeID { get; set; }
        public int ActivityType { get; set; }
        public string Details { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
