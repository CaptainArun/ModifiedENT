using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class DrugChartModel
    {
        #region entity properties
        public int DrugChartID { get; set; }
        public int PatientID { get; set; }
        public string AdmissionNo { get; set; }
        public int RecordedDuringID { get; set; }
        public string RecordedBy { get; set; }
        public DateTime DrugDate { get; set; }
        public string DrugName { get; set; }
        public string DrugRoute { get; set; }
        public string DosageDesc { get; set; }
        public string DrugTime { get; set; }
        public List<string> DrugTimes { get; set; }
        public string RateOfInfusion { get; set; }
        public string Frequency { get; set; }
        public string OrderingPhysician { get; set; }
        public string StopMedicationOn { get; set; }
        public string AdditionalInfo { get; set; }
        public string ProcedureType { get; set; }
        public string DrugSignOffBy { get; set; }
        public Nullable<DateTime> DrugSignOffDate { get; set; }
        public Nullable<bool> DrugSignOffStatus { get; set; }
        public Nullable<int> AdministratedBy { get; set; }
        public string AdministratedRemarks { get; set; }
        public string AdminDrugSignOffBy { get; set; }
        public Nullable<DateTime> AdminDrugSignOffDate { get; set; }
        public Nullable<bool> AdminDrugSignOffStatus { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }

        #endregion

        #region custom properties

        public string patientName { get; set; }
        public int FacilityId { get; set; }
        public string facilityName { get; set; }
        public string AdministratedByName { get; set; }
        public string recordedDuring { get; set; }
        public string AdmissionDateandTime { get; set; }

        #endregion
    }
}
