using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class HearingAidTrial
    {
        [Key]
        public int HearingAidTrialId { get; set; }
        public int VisitID { get; set; }
        public Nullable<int> LTEar { get; set; }
        public Nullable<int> RTEar { get; set; }
        public string NotesandInstructions { get; set; }
        public Nullable<DateTime> Starttime { get; set; }
        public Nullable<DateTime> Endtime { get; set; }
        public Nullable<int> Totalduration { get; set; }
        public Nullable<DateTime> Nextfollowupdate { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public string SignOffBy { get; set; }
        public Nullable<bool> SignOffStatus { get; set; }
    }
}
