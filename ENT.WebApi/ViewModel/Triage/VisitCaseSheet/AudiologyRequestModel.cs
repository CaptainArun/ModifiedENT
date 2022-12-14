using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AudiologyRequestModel
    {
        #region entity properties
        public int AudiologyRequestID { get; set; }
        public int VisitID { get; set; }
        public int ProviderId { get; set; }
        public bool TuningFork { get; set; }
        public bool SpecialTest { get; set; }
        public bool Tympanometry { get; set; }
        public bool OAE { get; set; }
        public bool BERA { get; set; }
        public bool ASSR { get; set; }
        public bool HearingAid { get; set; }
        public bool TinnitusMasking { get; set; }
        public bool SpeechTherapy { get; set; }
        public bool Electrocochleography { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties

        public string VisitDateandTime { get; set; }
        public string ProviderName { get; set; }
        public string PatientName { get; set; }
        public int PatientId { get; set; }
        public int FacilityId { get; set; }
        public string ToConsult { get; set; }
        public string facilityName { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
