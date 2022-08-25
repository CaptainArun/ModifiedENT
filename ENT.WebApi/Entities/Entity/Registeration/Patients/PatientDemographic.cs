using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientDemographic
    {
        [Key]
        public int PatientDemographicId { get; set; }
        public int PatientId { get; set; }
        public string PatientType { get; set; }
        public int FacilityId { get; set; }
        public string RegisterationAt { get; set; }
        public string PatientCategory { get; set; }
        public string Salutation { get; set; }
        public int IDTID1 { get; set; }
        public string PatientIdentificationtype1details { get; set; }
        public int IDTID2 { get; set; }
        public string PatientIdentificationtype2details { get; set; }
        public string MaritalStatus { get; set; }
        public string Religion { get; set; }
        public string Race { get; set; }
        public string Occupation { get; set; }
        public string email { get; set; }
        public string Emergencycontactnumber { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Village { get; set; }
        public string Town { get; set;}
        public string City { get; set; }
        public int Pincode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Bloodgroup { get; set;}
        public string NKSalutation { get; set;}
        public string NKFirstname { get; set;}
        public string NKLastname { get; set;}
        public string NKPrimarycontactnumber { get; set;}
        public string NKContactType { get; set;}
        public Nullable<int> RSPId { get; set;}
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
