using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderTreatmentCodeModel
    {
        #region entity properties
        public int ProviderTreatmentCodeID { get; set; }
        public int ProviderID { get; set; }
        public int TreatmentCodeID { get; set; }
        public string CPTCode { get; set; }
        public Boolean Deleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region Custom properties
        public string ProviderName { get; set; }
        public string codeStatus { get; set; }
        public string ProcedureCodeDesc { get; set; }
        #endregion
    }
}
