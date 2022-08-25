using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientAppointment
    {
        [Key]
        public int AppointmentID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentNo { get; set; }
        public int PatientID { get; set; }
        public string Reason { get; set; }
        public string Duration { get; set; }
        public int ProviderID { get; set; }
        public int FacilityID { get; set; }
        public string ToConsult { get; set; }
        public int AppointmentTypeID { get; set; }
        public int AppointmentStatusID { get; set; }
        public Nullable<int> CPTCode { get; set; }
        public Nullable<Boolean>AddToWaitList { get; set; }
        public Nullable<Boolean>IsRecurrence { get; set; }
        public Nullable<int> RecurrenceId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
