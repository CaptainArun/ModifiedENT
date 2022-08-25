using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderContactModel : BaseModel
    {
        #region entity properties
        public int ProviderContactID { get; set; }
        public int ProviderID { get; set; }
        public string CellNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string WhatsAppNumber { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string TelephoneNo { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
