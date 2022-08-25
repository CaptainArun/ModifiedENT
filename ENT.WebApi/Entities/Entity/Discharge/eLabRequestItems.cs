using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class eLabRequestItems
    {
        [Key]
        public int LabRequestItemsID { get; set; }
        public int LabRequestID { get; set; }
        public int SetupMasterID { get; set; }
        public string UrgencyCode { get; set; }
        public DateTime LabOnDate { get; set; }
        public string LabNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
