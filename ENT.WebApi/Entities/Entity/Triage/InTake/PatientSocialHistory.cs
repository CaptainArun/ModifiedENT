using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientSocialHistory
    {
        [Key]
        public int SocialHistoryId { get; set; }
        public int VisitId { get; set; }
        public int PatientId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public int Smoking { get; set; }
        public Nullable<int> CigarettesPerDay { get; set; }
        public Nullable<int> Drinking { get; set; }
        public Nullable<int> ConsumptionPerDay { get; set; }
        public string DrugHabitsDetails { get; set; }
        public string LifeStyleDetails { get; set; }
        public string CountriesVisited { get; set; }
        public string DailyActivities { get; set; }
        public string AdditionalNotes { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }

    }
}
