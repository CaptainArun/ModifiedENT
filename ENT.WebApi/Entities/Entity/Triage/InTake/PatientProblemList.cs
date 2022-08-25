using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientProblemList
    {
        [Key]
        public int ProblemlistId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public int ProblemTypeID { get; set; }
        public string ProblemDescription { get; set; }
        public string ICD10Code { get; set; }
        public string SNOMEDCode { get; set; }
        public string Aggravatedby { get; set; }
        public Nullable<DateTime> DiagnosedDate { get; set; }
        public Nullable<DateTime> ResolvedDate { get; set; }
        public string Status { get; set; }
        public string AttendingPhysican { get; set; }
        public string AlleviatedBy { get; set; }
        public string FileName { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
    }
}
