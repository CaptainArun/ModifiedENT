using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class NursingSignOffModel
    {
        #region entity properties
        public int NursingId { get; set; }
        public int PatientID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string ObservationsNotes { get; set; }
        public string FirstaidOrDressingsNotes { get; set; }
        public string NursingProceduresNotes { get; set; }
        public string NursingNotes { get; set; }
        public string AdditionalInformation { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string signOffstatus { get; set; }
        public List<clsViewFile> nursingFile { get; set; }

        #endregion
    }
}
