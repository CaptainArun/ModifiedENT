using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderExtraActivities
    {
        [Key]
        public int ProviderActivityId { get; set; }
        public int ProviderID { get; set; }
        public string NatureOfActivity { get; set; }
        public Nullable<int> YearOfParticipation { get; set; }
        public string PrizesorAwards { get; set; }
        public string StrengthandAreaneedImprovement { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
