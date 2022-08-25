using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class FamilyHealthHistory
    {
        [Key]
        public int FamilyHealthHistoryID { get; set; }
        public int VisitID { get; set; }
        public string ICDCode { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string FamilyMemberName { get; set; }
        public int FamilyMemberAge { get; set; }
        public string Relationship { get; set; }
        public string DiagnosisNotes { get; set; }
        public string IllnessType { get; set; }
        public string ProblemStatus { get; set; }
        public string PhysicianName { get; set; }
        public string AdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
