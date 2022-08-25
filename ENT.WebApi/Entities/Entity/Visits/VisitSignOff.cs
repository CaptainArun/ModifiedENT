using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class VisitSignOff
    {
        [Key]
        public int VisitSignOffID { get; set; }
        public int VisitID { get; set; }
        public bool Intake { get; set; }
        public string IntakeSignOffBy { get; set; }
        public Nullable<DateTime> IntakeSignOffDate { get; set; }
        public bool CaseSheet { get; set; }
        public string CaseSheetSignOffBy { get; set; }
        public Nullable<DateTime> CaseSheetSignOffDate { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
