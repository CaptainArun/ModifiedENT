using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientDemographicModel
    {
        #region entity properties
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
        public string Town { get; set; }
        public string City { get; set; }
        public int Pincode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Bloodgroup { get; set; }
        public string NKSalutation { get; set; }
        public string NKFirstname { get; set; }
        public string NKLastname { get; set; }
        public string NKPrimarycontactnumber { get; set; }
        public string NKContactType { get; set; }
        public Nullable<int> RSPId { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public string FacilityName { get; set; }
        public string PatientFirstName { get; set; }
        public string MRNo { get; set; }
        public string PatientFullName { get; set; }
        public string PatientMiddleName { get; set; }
        public string PatientLastName { get; set; }
        public string PatientStatus { get; set; }
        public DateTime PatientDOB { get; set; }
        public int PatientAge { get; set; }
        public string Gender { get; set; }
        public string PrimaryContactNumber { get; set; }
        public string PrimaryContactType { get; set; }
        public string SecondaryContactNumber { get; set; }
        public string SecondaryContactType { get; set; }
        public string Relationship { get; set; }
        public string IdType1 { get; set; }
        public string IdType2 { get; set; }
        public string HighBP { get; set; }
        public string Diabetic { get; set; }
        public string Allergies { get; set; }
        public string Gait { get; set; }
        public decimal billedAmount { get; set; }
        public decimal paidAmount { get; set; }
        public decimal balanceAmount { get; set; }
        public List<clsViewFile> PatientFile { get; set; }
        public string PatientImage { get; set; }
        public string QRImage { get; set; }
        #endregion
    }
}
