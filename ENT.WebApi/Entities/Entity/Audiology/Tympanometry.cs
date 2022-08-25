using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Tympanometry
    {
        [Key]
        public int TympanogramId { get; set; }
        public int VisitID { get; set; }
        public Nullable<int> ECVRight { get; set; }
        public Nullable<int> ECVLeft { get; set; }
        public Nullable<int> MEPRight { get; set; }
        public Nullable<int> MEPLeft { get; set; }
        public Nullable<int> SCRight { get; set; }
        public Nullable<int> SCLeft { get; set; }
        public Nullable<int> GradRight { get; set; }
        public Nullable<int> GradLeft { get; set; }
        public Nullable<int> TWRight { get; set; }
        public Nullable<int> TWLeft { get; set; }
        public Nullable<int> SpeedRight { get; set; }
        public Nullable<int> SpeedLeft { get; set; }
        public Nullable<int> DirectionRight { get; set; }
        public Nullable<int> DirectionLeft { get; set; }
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
