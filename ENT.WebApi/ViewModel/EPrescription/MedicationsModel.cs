using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class MedicationsModel
    {
        #region entity properties

        public int MedicationId { get; set; }
        public int VisitID { get; set; }
        public int AdmissionID { get; set; }
        public int MedicationPhysician { get; set; }
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
        public string MedicationStatus { get; set; }
        public string MedicationNumber { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }

        #endregion

        #region custom properties

        public List<MedicationItemsModel> medicationItems { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ValidationStatus { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public string Sex { get; set; }
        public int Age { get; set; }
        public string MRNumber { get; set; }
        public string PatientAddress { get; set; }
        public string PatientContactNumber { get; set; }
        public int ProviderId { get; set; }
        public string physicianName { get; set; }
        public string ProviderAddress { get; set; }
        public string ProviderContactNumber { get; set; }
        public string ProviderSpecialities { get; set; }
        public int FacilityID { get; set; }
        public string facilityName { get; set; }
        public string facilityNumber { get; set; }
        public string facilityAddress { get; set; }
        public string facilityContactNumber { get; set; }
        public string facilitySpecialities { get; set; }
        public string AdmissionNo { get; set; }
        public string AdmissionDateandTime { get; set; }
        public string VisitNo { get; set; }
        public string VisitDateandTime { get; set; }
        public string ProviderSign { get; set; }
        public string TenantLogo { get; set; }

        #endregion
    }
}
