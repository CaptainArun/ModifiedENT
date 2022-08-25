using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class EmployeeEducationInfo
    {
        [Key]
        public int EmployeeEducationID { get; set; }
        public int EmployeeID { get; set; }
        public string University { get; set; }
        public Nullable<int> Month { get; set; }
        public Nullable<int> Year { get; set; }
        public string InstituteName { get; set; }
        public string Percentage { get; set; }
        public string Branch { get; set; }
        public string MainSubject { get; set; }
        public string Scholorship { get; set; }
        public string Qualification { get; set; }
        public string Duration { get; set; }
        public string PlaceOfInstitute { get; set; }
        public string RegistrationAuthority { get; set; }
        public string RegistrationNo { get; set; }
        public Nullable<DateTime> RegistrationExpiryDate { get; set; }
        public string AdditionalInfo { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
