using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.Entities
{
    public partial class Provider
    {
        [Key]
        public int ProviderID { get; set; }
        public string UserID { get; set; }
        public string FacilityId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string NamePrefix { get; set; }
        public string NameSuffix { get; set; }
        public string Title { get; set; }
        public Nullable<DateTime> BirthDate { get; set; }
        public string Gender { get; set; }
        public string PersonalEmail { get; set; }
        public bool IsActive { get; set; }
        public string Language { get; set; }
        public string PreferredLanguage { get; set; }
        public string MotherMaiden { get; set; }
        public string WebSiteName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

    }
}
