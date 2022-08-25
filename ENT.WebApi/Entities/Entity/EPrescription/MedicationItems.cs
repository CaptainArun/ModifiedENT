using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class MedicationItems
    {
        [Key]
        public int MedicationItemsId { get; set; }
        public int MedicationID { get; set; }
        public string DrugName { get; set; }
        public string MedicationRouteCode { get; set; }
        public string ICDCode { get; set; }
        public int TotalQuantity { get; set; }
        public int NoOfDays { get; set; }
        public bool Morning { get; set; }
        public bool Brunch { get; set; }
        public bool Noon { get; set; }
        public bool Evening { get; set; }
        public bool Night { get; set; }
        public bool Before { get; set; }
        public bool After { get; set; }
        public bool Start { get; set; }
        public bool Hold { get; set; }
        public bool Continued { get; set; }
        public bool DisContinue { get; set; }
        public string SIG { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
    }
}
