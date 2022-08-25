using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PhysicalExam
    {
        [Key]
        public int PhysicalExamID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string HeadValue { get; set; }
        public string HeadDesc { get; set; }
        public string EARValue { get; set; }
        public string EARDesc { get; set; }
        public string MouthValue { get; set; }
        public string MouthDesc { get; set; }
        public string ThroatValue { get; set; }
        public string ThroatDesc { get; set; }
        public string HairValue { get; set; }
        public string HairDesc { get; set; }
        public string NeckValue { get; set; }
        public string NeckDesc { get; set; }
        public string SpineValue { get; set; }
        public string SpineDesc { get; set; }
        public string SkinValue { get; set; }
        public string SkinDesc { get; set; }
        public string LegValue { get; set; }
        public string LegDesc { get; set; }
        public string SensationValue { get; set; }
        public string SensationDesc { get; set; }
        public string EyeValue { get; set; }
        public string EyeDesc { get; set; }
        public string NoseValue { get; set; }
        public string NoseDesc { get; set; }
        public string TeethValue { get; set; }
        public string TeethDesc { get; set; }
        public string ChestValue { get; set; }
        public string ChestDesc { get; set; }
        public string ThoraxValue { get; set; }
        public string ThoraxDesc { get; set; }
        public string AbdomenValue { get; set; }
        public string AbdomenDesc { get; set; }
        public string PelvisValue { get; set; }
        public string PelvisDesc { get; set; }
        public string NailsValue { get; set; }
        public string NailsDesc { get; set; }
        public string FootValue { get; set; }
        public string FootDesc { get; set; }
        public string HandValue { get; set; }
        public string HandDesc { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
