using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderAddressModel : BaseModel
    {
        #region entity properties
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
        #endregion
    }
}
