using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientCaseSheetModel
    {
        #region entity properties
        public int CaseSheetId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public int ProviderId { get; set; }
        public Nullable<int> procedureId { get; set; }
        public Nullable<int> CarePlanId { get; set; }
        public Nullable<int> DiagnosisId { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        #endregion

        #region custom properties
        public CarePlanModel carePlanModel { get; set; }
        public DiagnosisModel diagnosisModel { get; set; }
        public CaseSheetProcedureModel procedureModel { get; set; }
        public string PatientName { get; set; }
        public int FacilityId { get; set; }
        public string ProviderName { get; set; }
        public string VisitDateandTime { get; set; }
        public string facilityName { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
