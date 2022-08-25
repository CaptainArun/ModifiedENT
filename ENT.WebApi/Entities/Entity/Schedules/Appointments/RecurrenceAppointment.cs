using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class RecurrenceAppointment
    {
        [Key]
        public int RecurrenceId { get; set; }
        public DateTime RecurrenceFrom { get; set; }
        public DateTime RecurrenceTo { get; set; }
        public Nullable<Boolean> Deleted { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
    }
}
