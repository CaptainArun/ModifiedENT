using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientVitals
    {
        [Key]
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
    }
}
