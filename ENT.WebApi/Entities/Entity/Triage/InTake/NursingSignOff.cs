using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class NursingSignOff
    {
        [Key]
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
    }
}
