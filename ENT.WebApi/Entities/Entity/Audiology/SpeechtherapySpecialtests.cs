using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class SpeechtherapySpecialtests
    {
        [Key]
        public int SpeechTherapySpecialTestId { get; set; }
        public int VisitID { get; set; }
        public string ChiefComplaint { get; set; }
        public Nullable<int> SRTRight { get; set; }
        public Nullable<int> SRTLeft { get; set; }
        public Nullable<int> SDSRight { get; set; }
        public Nullable<int> SDSLeft { get; set; }
        public Nullable<int> SISIRight { get; set; }
        public Nullable<int> SISILeft { get; set; }
        public Nullable<int> TDTRight { get; set; }
        public Nullable<int> TDTLeft { get; set; }
        public Nullable<int> ABLBLeft { get; set; }
        public Nullable<int> ABLBRight { get; set; }
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
