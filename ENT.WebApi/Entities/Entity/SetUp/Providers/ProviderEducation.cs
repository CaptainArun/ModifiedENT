using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ProviderEducation
    {
        [Key]
        public int ProviderEducationId { get; set; }
        public int ProviderID { get; set; }
        public string EducationType { get; set; }
        public string BoardorUniversity { get; set; }
        public Nullable<DateTime> MonthandYearOfPassing { get; set; }
        public string NameOfSchoolorCollege { get; set; }
        public string MainSubjects { get; set; }
        public string PercentageofMarks { get; set; }
        public string HonoursorScholarshipHeading { get; set; }
        public string ProjectWorkUndertakenHeading { get; set; }
        public string PublicationsorPapers { get; set; }
        public string Qualification { get; set; }
        public string DurationOfQualification { get; set; }
        public string NameOfInstitution { get; set; }
        public string PlaceOfInstitution { get; set; }
        public string RegisterationAuthority { get; set; }
        public string RegisterationNumber { get; set; }
        public string ExpiryOfRegisterationNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
