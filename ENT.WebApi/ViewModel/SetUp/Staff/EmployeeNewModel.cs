using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class EmployeeNewModel
    {
        #region entity properties
        public int EmployeeId { get; set; }
        public string UserId { get; set; }
        public string FacilityId { get; set; }
        public int RoleId { get; set; }
        public Nullable<int> EmployeeDepartment { get; set; }
        public Nullable<int> EmployeeCategory { get; set; }
        public Nullable<int> EmployeeUserType { get; set; }
        public string EmployeeNo { get; set; }
        public Nullable<DateTime> DOJ { get; set; }
        public Nullable<int> SchedulerDepartment { get; set; }
        public string AdditionalInfo { get; set; }
        public Nullable<int> EmployeeSalutation { get; set; }
        public string EmployeeFirstName { get; set; }
        public string EmployeeMiddleName { get; set; }
        public string EmployeeLastName { get; set; }
        public Nullable<int> Gender { get; set; }
        public DateTime EmployeeDOB { get; set; }
        public int EmployeeAge { get; set; }
        public int EmployeeIdentificationtype1 { get; set; }
        public string EmployeeIdentificationtype1details { get; set; }
        public int EmployeeIdentificationtype2 { get; set; }
        public string EmployeeIdentificationtype2details { get; set; }
        public string MaritalStatus { get; set; }
        public string MothersMaiden { get; set; }
        public string PreferredLanguage { get; set; }
        public string Bloodgroup { get; set; }
        public string CellNo { get; set; }
        public string PhoneNo { get; set; }
        public string WhatsAppNo { get; set; }
        public string EMail { get; set; }
        public Nullable<int> EmergencySalutation { get; set; }
        public string EmergencyFirstName { get; set; }
        public string EmergencyLastName { get; set; }
        public Nullable<int> EmergencyContactType { get; set; }
        public string EmergencyContactNo { get; set; }
        public string TelephoneNo { get; set; }
        public string Fax { get; set; }
        public Nullable<int> RelationshipToEmployee { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties

        public string FacilityName { get; set; }
        public string EmployeeFullname { get; set; }
        public List<int> FacilityArray { get; set; }
        public string Languages { get; set; }
        public List<int> LanguageArray { get; set; }
        public List<string> LanguageList { get; set; }
        public string RoleDesc { get; set; }
        public string EmployeeDepartmentDesc { get; set; }
        public string EmployeeCategoryDesc { get; set; }
        public string EmployeeUserTypeDesc { get; set; }
        public string SchedulerDepartmentDesc { get; set; }
        public string EmployeeSalutationDesc { get; set; }
        public string GenderDesc { get; set; }
        public string EmergencySalutationDesc { get; set; }
        public string EmergencyContactTypeDesc { get; set; }
        public string RelationshipToEmployeeDesc { get; set; }
        public List<EmployeeAddressInfoModel> staffAddressDetails { get; set; }
        public List<EmployeeCampusModel> staffCampusDetails { get; set; }
        public List<EmployeeEducationInfoModel> staffEducationDetails { get; set; }
        public List<EmployeeFamilyInfoModel> staffFamilyDetails { get; set; }
        public List<EmployeeHobbyInfoModel> staffHobbyDetails { get; set; }
        public List<EmployeeLanguageInfoModel> staffLanguageDetails { get; set; }
        public List<EmployeeWorkHistoryModel> staffWorkDetails { get; set; }
        public List<clsViewFile> StaffFile { get; set; }
        public string StaffImage { get; set; }

        #endregion
    }
}
