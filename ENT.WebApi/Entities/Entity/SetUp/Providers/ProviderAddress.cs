using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderAddress 
    {
        [Key]
        public int ProviderAddressID { get; set; }
        public int ProviderID { get; set; }
        public string AddressType { get; set; }
        public string DoorOrApartmentNo { get; set; }
        public string ApartmentNameOrHouseName { get; set; }
        public string StreetName { get; set; }
        public string Locality { get; set; }
        public string Town { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public Nullable<int> PinCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
