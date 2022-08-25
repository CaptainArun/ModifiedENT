using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderVacationModel
    {
        #region entity properties
        public int ProvidervacationID { get; set; }
        public int ProviderID { get; set; }
        public string Reason { get; set; }
        public Nullable<DateTime> StartDate { get; set; }
        public Nullable<DateTime> EndDate { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region Custom properties
        public string ProviderName { get; set; }
        public string status { get; set; }
        #endregion
    }
}
