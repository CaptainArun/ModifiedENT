using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderFamilyDetailsModel : BaseModel
    {
        #region entity properties
        public int ProviderFamilyDetailId { get; set; }
        public int ProviderID { get; set; }
        public string FullName { get; set; }
        public Nullable<int> Age { get; set; }
        public string RelationShip { get; set; }
        public string Occupation { get; set; }
        public string Notes { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
