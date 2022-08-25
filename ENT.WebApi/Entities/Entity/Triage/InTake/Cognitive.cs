using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Cognitive
    {
        [Key]
        public int CognitiveID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public Nullable<int> Gait { get; set; }
        public string GaitNotes { get; set; }
        public string Balance { get; set; }
        public string BalanceNotes { get; set; }
        public string NeuromuscularNotes { get; set; }
        public string Mobility { get; set; }
        public string MobilitySupportDevice { get; set; }
        public string MobilityNotes { get; set; }
        public string Functionalstatus { get; set; }
        public string Cognitivestatus { get; set; }
        public string PrimaryDiagnosisNotes { get; set; }
        public string ICD10 { get; set; }
        public string PrimaryProcedure { get; set; }
        public string CPT { get; set; }
        public string Physicianname { get; set; }
        public string Hospital { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public int PatientID { get; set; }
        public int VisitID { get; set; }
    }
}
