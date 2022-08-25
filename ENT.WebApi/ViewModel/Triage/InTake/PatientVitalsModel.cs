using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientVitalsModel
    {
        #region entity Properties
        public int VitalsId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public decimal BMI { get; set; }
        public string WaistCircumference { get; set; }
        public decimal BPSystolic { get; set; }
        public decimal BPDiastolic { get; set; }
        public int BPLocationID { get; set; }
        public int Temperature { get; set; }
        public int TemperatureLocation { get; set; }
        public decimal HeartRate { get; set; }
        public decimal RespiratoryRate { get; set; }
        public decimal O2Saturation { get; set; }
        public Nullable<decimal> BloodsugarRandom { get; set; }
        public Nullable<decimal> BloodsugarFasting { get; set; }
        public Nullable<decimal> BloodSugarPostpardinal { get; set; }
        public string PainArea { get; set; }
        public Nullable<int> PainScale { get; set; }
        public Nullable<int> HeadCircumference { get; set; }
        public string LastMealdetails { get; set; }
        public bool IsActive { get; set; }
        public Nullable<DateTime> LastMealtakenon { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public Nullable<int> PatientPosition { get; set; }
        public string IsBloodPressure { get; set; }
        public string IsDiabetic { get; set; }
        public string Notes { get; set; }
        #endregion

        #region custom properties
        public string BPLocation { get; set; }
        public string signOffstatus { get; set; }
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }
        public string Diabetic { get; set; }
        public string BloodPressure { get; set; }
        public string PainScaleDesc { get; set; }
        #endregion
    }
}
