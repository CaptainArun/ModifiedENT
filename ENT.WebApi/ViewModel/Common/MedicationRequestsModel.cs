using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class MedicationRequestsModel
    {
        #region entity proeprties

        public int MedicationRequestId { get; set; }
        public int VisitID { get; set; }
        public int AdmissionID { get; set; }
        public Nullable<bool> TakeRegularMedication { get; set; }
        public Nullable<bool> IsHoldRegularMedication { get; set; }
        public string HoldRegularMedicationNotes { get; set; }
        public Nullable<bool> IsDiscontinueDrug { get; set; }
        public string DiscontinueDrugNotes { get; set; }
        public Nullable<bool> IsPharmacist { get; set; }
        public string PharmacistNotes { get; set; }
        public Nullable<bool> IsRefill { get; set; }
        public Nullable<int> RefillCount { get; set; }
        public Nullable<DateTime> RefillDate { get; set; }
        public string RefillNotes { get; set; }
        public string MedicationRequestStatus { get; set; }
        public Nullable<DateTime> RequestedDate { get; set; }
        public string RequestedBy { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }

        #endregion

        #region custom properties

        public string VisitDateandTime { get; set; }
        public int PatientId { get; set; }
        public int providerId { get; set; }
        public int FacilityId { get; set; }
        public string PatientName { get; set; }
        public string facilityName { get; set; }
        public string RequestingPhysician { get; set; }
        public string AdmissionDateandTime { get; set; }
        public List<MedicationRequestItemsModel> medicationRequestItems { get; set; }

        #endregion
    }
}
