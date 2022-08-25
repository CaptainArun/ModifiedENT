using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientMedicationHistoryModel
    {
        #region entity properties
        public int PatientmedicationId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string DrugName { get; set; }
        public string MedicationRouteCode { get; set; }
        public string ICDCode { get; set; }
        public int TotalQuantity { get; set; }
        public int NoOfDays { get; set; }
        public bool Morning { get; set; }
        public bool Brunch { get; set; }
        public bool Noon { get; set; }
        public bool Evening { get; set; }
        public bool Night { get; set; }
        public bool Before { get; set; }
        public bool After { get; set; }
        public bool Start { get; set; }
        public bool Hold { get; set; }
        public bool Continued { get; set; }
        public bool DisContinue { get; set; }
        public string SIG { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        #endregion

        #region custom properties
        public string PrescriptionOrderType { get; set; }
        public string medicationStatus { get; set; }
        public string medicationRoute { get; set; }
        public string medicationUnit { get; set; }
        public string dosageForm { get; set; }
        public string dispenseForm { get; set; }
        public string signOffstatus { get; set; }
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }

        #endregion
    }
}
