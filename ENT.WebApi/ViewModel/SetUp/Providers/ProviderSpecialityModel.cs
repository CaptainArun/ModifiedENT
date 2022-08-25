using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderSpecialityModel
    {
        #region entity properties
        public int ProviderSpecialtyID { get; set; }
        public int SpecialityID { get; set; }
        public string SpecialityCode { get; set; }
        public string SpecialityDescription { get; set; }
        public Nullable<DateTime> EffectiveDate { get; set; }
        public Nullable<DateTime> TerminationDate { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public int ProviderID { get; set; }
        #endregion

        #region Custom properties
        public string ProviderName { get; set; }
        #endregion
    }
}
