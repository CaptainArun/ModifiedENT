using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderExtraActivitiesModel : BaseModel
    {
        #region entity properties
        public int ProviderActivityId { get; set; }
        public int ProviderID { get; set; }
        public string NatureOfActivity { get; set; }
        public Nullable<int> YearOfParticipation { get; set; }
        public string PrizesorAwards { get; set; }
        public string StrengthandAreaneedImprovement { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
