using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class SearchModel
    {
        public Nullable<DateTime> FromDate { get; set; }
        public Nullable<DateTime> ToDate { get; set; }
        public string LabOrderNo { get; set; }
        public string MedicationNo { get; set; }
        public string AdmissionNo { get; set; }
        public string AppointmentNo { get; set; }
        public string VisitNo { get; set; }
        public string receiptNo { get; set; }
        public string status { get; set; }
        public int PatientId { get; set; }
        public int ProviderId { get; set; }
        public int SpecialityId { get; set; }
        public int FacilityId { get; set; }
    }
}
