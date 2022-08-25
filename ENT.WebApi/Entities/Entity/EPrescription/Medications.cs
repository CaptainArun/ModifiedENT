using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Medications
    {
        [Key]
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
    }
}
