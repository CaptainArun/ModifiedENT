using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderContact
    {
        [Key]
        public int ProviderContactID { get; set; }
        public int ProviderID { get; set; }
        public string CellNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string TelephoneNo { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
