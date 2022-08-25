using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderDiagnosisCodeModel
    {
        #region entity properties
        public int ProviderDiagnosisCodeID { get; set; }
        public int ProviderID { get; set; }
        public int DiagnosisCodeID { get; set; }
        public string ICDCode { get; set; }
        public Boolean Deleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region Custom Properties
        public string ProviderName { get; set; }
        public string codeStatus { get; set; }
        public string diagnosisCodeDesc { get; set; }
        #endregion
    }
}
