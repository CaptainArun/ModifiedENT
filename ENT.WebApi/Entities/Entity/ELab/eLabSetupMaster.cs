using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class eLabSetupMaster
    {
        [Key]
        public int SetupMasterID { get; set; }
        public int DepartmentID { get; set; }
        public int LabMasterID { get; set; }
        public Nullable<int> LabSubMasterID { get; set; }
        public string Status { get; set; }
        public int OrderNo { get; set; }
        public decimal Charges { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
