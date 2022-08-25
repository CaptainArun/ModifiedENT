using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderModel
    {
        #region entity properties
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
        public string PhoneNumber { get; set; }        
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
        #endregion

        #region custom properties

        public string FacilityName { get; set; }
        public List<int> FacilityArray { get; set; }
        public int Age { get; set; }
        public string ProviderName { get; set; }
        public string RoleDescription { get; set; }
        public string SpecialityDescription { get; set; }
        public string State { get; set; }
        public int Pincode { get; set; }        
        public string Bloodgroup { get; set; }
        public List<ProviderAddressModel> providerAddresses { get; set; }
        public List<ProviderContactModel> providerContacts { get; set; }
        public List<ProviderEducationModel> educations { get; set; }
        public List<ProviderFamilyDetailsModel> familyDetails { get; set; }
        public List<ProviderLanguagesModel> languages { get; set; }
        public List<ProviderExtraActivitiesModel> extraActivities { get; set; }
        public List<clsViewFile> ProviderFile { get; set; }
        public string ProviderImage { get; set; }
        public string ProviderSign { get; set; }

        #endregion
    }
}
