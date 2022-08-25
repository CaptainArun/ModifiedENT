using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ENT.WebApi.DAL.Services
{
    public class StaffService : IStaffService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        public readonly IHostingEnvironment hostingEnvironment;

        public StaffService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master Data

        //// <summary>
        ///// Get Genders for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Gender>. if Collection of Genders Records = success. else = failure</returns>
        public List<Gender> GetGenderList()
        {
            var genders = this.iTenantMasterService.GetAllGender();

            return genders;
        }

        //// <summary>
        ///// Get Address Types for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AddressType>. if Collection of AddressType = success. else = failure</returns>
        public List<AddressType> GetAddressTypeList()
        {
            var addressTypes = this.iTenantMasterService.GetAllAddressTypes();

            return addressTypes;
        }

        //// <summary>
        ///// Get Languages for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Language>. if Collection of Language Records = success. else = failure</returns>
        public List<Language> GetLanguageList()
        {
            var languages = this.iTenantMasterService.GetAllLanguages();

            return languages;
        }

        //// <summary>
        ///// Get All Salutation for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Salutation>. if Collection of Salutation Records = success. else = failure</returns>
        public List<Salutation> GetSalutationList()
        {
            var salutations = this.iTenantMasterService.GetAllSalutations();

            return salutations;
        }

        ///// <summary>
        ///// Get All Department records for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Departments>. if Collection of Department Records = success. else = failure</returns>
        public List<Departments> GetAllDepartments()
        {
            var departments = this.iTenantMasterService.GetDepartmentList();

            return departments;
        }

        ///// <summary>
        ///// Get All available IdentificationTypes for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<IdentificationIdType>. if Collection of IdentificationTypes = success. else = failure</returns>
        public List<IdentificationIdType> GetIdentificationTypeList()
        {
            List<IdentificationIdType> IdTypes = this.iTenantMasterService.GetAllIdentificationTypes();
            return IdTypes;
        }

        ///// <summary>
        ///// Get Marital Status List for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MaritalStatus>. if Collection of Marital Status = success. else = failure</returns>
        public List<MaritalStatus> GetAllMaritalStatuses()
        {
            var maritalStatuses = this.iTenantMasterService.GetMaritalStatuses();

            return maritalStatuses;
        }

        ///// <summary>
        ///// Get BloodGroup List for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BloodGroup>. if Collection of BloodGroup = success. else = failure</returns>
        public List<BloodGroup> GetBloodGroupList()
        {
            var bloodGroups = this.iTenantMasterService.GetAllBloodGroups();

            return bloodGroups;
        }

        ///// <summary>
        ///// Get Contact Type List for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ContactType>. if Collection of Contact Types = success. else = failure</returns>
        public List<ContactType> GetContactTypeList()
        {
            var contactTypes = this.iTenantMasterService.GetContactTypes();

            return contactTypes;
        }

        //// <summary>
        ///// Get Relationships to Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Relationshiptopatient>. if collection of Relationship to patient = success. else = failure</returns>
        public List<Relationshiptopatient> GetAllRelations()
        {
            List<Relationshiptopatient> Relations = this.iTenantMasterService.GetRelationstoPatient();
            return Relations;
        }

        //// <summary>
        ///// Get States for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<State>. if Collection of State = success. else = failure</returns>
        public List<State> GetStateList()
        {
            var states = this.iTenantMasterService.GetAllStates();

            return states;
        }

        //// <summary>
        ///// Get Countries for Staff
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Country>. if Collection of Country = success. else = failure</returns>
        public List<Country> GetCountryList()
        {
            var countries = this.iTenantMasterService.GetAllCountries();

            return countries;
        }

        ///// <summary>
        ///// Get Roles List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Roles>. if Collection of Roles = success. else = failure</returns>
        public List<Roles> GetRoles()
        {
            var roleRecords = this.iTenantMasterService.GetRolesList();

            return roleRecords;
        }

        ///// <summary>
        ///// Get the Facility collection
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<Facility>. if facility collection = success. else = failure</returns>
        public List<Facility> GetFacilitiesbyEmployeeId(int employeeId)
        {
            List<Facility> facilities = new List<Facility>();
            var EmpData = this.uow.GenericRepository<Employee>().Table().Where(x => x.EmployeeId == employeeId).FirstOrDefault();

            if (EmpData != null && (EmpData.FacilityId != null && EmpData.FacilityId != ""))
            {
                if (EmpData.FacilityId.Contains(","))
                {
                    string[] facilityIds = EmpData.FacilityId.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(EmpData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        ///// <summary>
        ///// Get the Facility (local method)
        ///// </summary>
        ///// <param>string facilityset</param>
        ///// <returns>List<Facility>. if facility collection = success. else = failure</returns>
        public List<Facility> GetFacilitiesbyFacilityId(string facilityset)
        {
            List<Facility> facilities = new List<Facility>();

            if (facilityset != null && facilityset != "")
            {
                if (facilityset.Contains(","))
                {
                    string[] facilityIds = facilityset.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityset)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        ///// <summary>
        ///// Get User type
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UserType>. if Collection of User Typr = success. else = failure</returns>
        public List<UserType> GetUserType()
        {
            var records = this.iTenantMasterService.GetUserType();

            return records;
        }

        ///// <summary>
        ///// Get EmpExtracurricularActivitiesType
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<EmpExtracurricularActivitiesType>. if Collection of User Typr = success. else = failure</returns>
        public List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType()
        {
            var records = this.iTenantMasterService.GetEmpExtracurricularActivitiesType();

            return records;
        }

        ///// <summary>
        ///// Get Patient for search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForSearch(string searchKey)
        {
            List<Patient> patients = new List<Patient>();
            var facList = this.utilService.GetFacilitiesforUser();

            if (facList.Count() > 0)
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            join fac in facList on patDemo.FacilityId equals fac.FacilityId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();
            }
            else
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();
            }

            return patients;
        }

        ///// <summary>
        ///// Get Department for search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Departments> If Departments table data collection returns = success. else = failure</returns>
        public List<Departments> GetDepartmentsForSearch(string searchKey)
        {
            var departments = (from department in this.uow.GenericRepository<Departments>().Table().Where(x => x.IsActive == true)

                               where (searchKey == null || (department.DepartCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || department.DepartmentDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                               select department).Distinct().Take(10).ToList();
            return departments;
        }

        ///// <summary>
        ///// Get Languages for search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Language> If Language table data collection returns = success. else = failure</returns>
        public List<Language> GetLanguagesForSearch(string searchKey)
        {
            var Languages = (from language in this.uow.GenericRepository<Language>().Table().Where(x => x.IsActive == true)

                             where (searchKey == null || (language.LanguageCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || language.LanguageDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                             select language).Distinct().Take(10).ToList();
            return Languages;
        }

        ///// <summary>
        ///// Get Employee number 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> List<string>. if Employee number = success. else = failure</returns>
        public List<string> GetEmployeeNumber()
        {
            List<string> EmployeeNo = new List<string>();

            var empNo = this.iTenantMasterService.GetEmployeeNo();

            EmployeeNo.Add(empNo);

            return EmployeeNo;
        }

        #endregion

        #region Staff (Employee)

        ///// <summary>
        ///// Add or Update Staff Record
        ///// </summary>
        ///// <param>EmployeeNewModel employeeModel</param>
        ///// <returns>EmployeeNewModel. if Staff(Employee) record added or updated = success. else = failure</returns>
        public EmployeeNewModel AddUpdateStaffRecord(EmployeeNewModel employeeModel)
        {
            var getEmpNoCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                  where common.CommonMasterCode.ToLower().Trim() == "empno"
                                  select common).FirstOrDefault();

            var EmpNoCheck = this.uow.GenericRepository<Employee>().Table()
                            .Where(x => x.EmployeeNo.ToLower().Trim() == getEmpNoCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();
            var empRecord = this.uow.GenericRepository<Employee>().Table().Where(x => x.EmployeeId == employeeModel.EmployeeId).SingleOrDefault();

            if (empRecord == null)
            {
                string myguid = Guid.NewGuid().ToString();
                empRecord = new Employee();

                empRecord.UserId = myguid;
                empRecord.FacilityId = employeeModel.FacilityId;
                empRecord.RoleId = employeeModel.RoleId;
                empRecord.EmployeeDepartment = employeeModel.EmployeeDepartment;
                empRecord.EmployeeCategory = employeeModel.EmployeeCategory;
                empRecord.EmployeeUserType = employeeModel.EmployeeUserType;
                empRecord.EmployeeNo = EmpNoCheck != null ? employeeModel.EmployeeNo : getEmpNoCommon.CommonMasterDesc;
                empRecord.DOJ = employeeModel.DOJ != null ? this.utilService.GetLocalTime(employeeModel.DOJ.Value) : employeeModel.DOJ;
                empRecord.SchedulerDepartment = employeeModel.SchedulerDepartment;
                empRecord.AdditionalInfo = employeeModel.AdditionalInfo;
                empRecord.EmployeeSalutation = employeeModel.EmployeeSalutation;
                empRecord.EmployeeFirstName = employeeModel.EmployeeFirstName;
                empRecord.EmployeeMiddleName = employeeModel.EmployeeMiddleName;
                empRecord.EmployeeLastName = employeeModel.EmployeeLastName;
                empRecord.Gender = employeeModel.Gender;
                empRecord.EmployeeDOB = this.utilService.GetLocalTime(employeeModel.EmployeeDOB);
                empRecord.EmployeeAge = employeeModel.EmployeeAge;
                empRecord.EmployeeIdentificationtype1 = employeeModel.EmployeeIdentificationtype1;
                empRecord.EmployeeIdentificationtype1details = employeeModel.EmployeeIdentificationtype1details;
                empRecord.EmployeeIdentificationtype2 = employeeModel.EmployeeIdentificationtype2;
                empRecord.EmployeeIdentificationtype2details = employeeModel.EmployeeIdentificationtype2details;
                empRecord.MaritalStatus = employeeModel.MaritalStatus;
                empRecord.MothersMaiden = employeeModel.MothersMaiden;
                empRecord.PreferredLanguage = employeeModel.PreferredLanguage;
                empRecord.Bloodgroup = employeeModel.Bloodgroup;
                empRecord.CellNo = employeeModel.CellNo;
                empRecord.PhoneNo = employeeModel.PhoneNo;
                empRecord.WhatsAppNo = employeeModel.WhatsAppNo;
                empRecord.EMail = employeeModel.EMail;
                empRecord.EmergencySalutation = employeeModel.EmergencySalutation;
                empRecord.EmergencyFirstName = employeeModel.EmergencyFirstName;
                empRecord.EmergencyLastName = employeeModel.EmergencyLastName;
                empRecord.EmergencyContactType = employeeModel.EmergencyContactType;
                empRecord.EmergencyContactNo = employeeModel.EmergencyContactNo;
                empRecord.TelephoneNo = employeeModel.TelephoneNo;
                empRecord.Fax = employeeModel.Fax;
                empRecord.RelationshipToEmployee = employeeModel.RelationshipToEmployee;
                empRecord.IsActive = employeeModel.IsActive;
                empRecord.Createddate = DateTime.Now;
                empRecord.CreatedBy = "User";

                this.uow.GenericRepository<Employee>().Insert(empRecord);
                this.uow.Save();

                getEmpNoCommon.CurrentIncNo = empRecord.EmployeeNo;
                this.uow.GenericRepository<CommonMaster>().Update(getEmpNoCommon);
                this.uow.Save();
            }
            else
            {
                if (empRecord.FacilityId.ToLower().Trim() == empRecord.FacilityId.ToLower().Trim())
                {
                    empRecord.FacilityId = employeeModel.FacilityId;
                    empRecord.RoleId = employeeModel.RoleId;
                    empRecord.EmployeeDepartment = employeeModel.EmployeeDepartment;
                    empRecord.EmployeeCategory = employeeModel.EmployeeCategory;
                    empRecord.EmployeeUserType = employeeModel.EmployeeUserType;
                    empRecord.EmployeeNo = employeeModel.EmployeeNo;
                    empRecord.DOJ = employeeModel.DOJ != null ? this.utilService.GetLocalTime(employeeModel.DOJ.Value) : employeeModel.DOJ;
                    empRecord.SchedulerDepartment = employeeModel.SchedulerDepartment;
                    empRecord.AdditionalInfo = employeeModel.AdditionalInfo;
                    empRecord.EmployeeSalutation = employeeModel.EmployeeSalutation;
                    empRecord.EmployeeFirstName = employeeModel.EmployeeFirstName;
                    empRecord.EmployeeMiddleName = employeeModel.EmployeeMiddleName;
                    empRecord.EmployeeLastName = employeeModel.EmployeeLastName;
                    empRecord.Gender = employeeModel.Gender;
                    empRecord.EmployeeDOB = this.utilService.GetLocalTime(employeeModel.EmployeeDOB);
                    empRecord.EmployeeAge = employeeModel.EmployeeAge;
                    empRecord.EmployeeIdentificationtype1 = employeeModel.EmployeeIdentificationtype1;
                    empRecord.EmployeeIdentificationtype1details = employeeModel.EmployeeIdentificationtype1details;
                    empRecord.EmployeeIdentificationtype2 = employeeModel.EmployeeIdentificationtype2;
                    empRecord.EmployeeIdentificationtype2details = employeeModel.EmployeeIdentificationtype2details;
                    empRecord.MaritalStatus = employeeModel.MaritalStatus;
                    empRecord.MothersMaiden = employeeModel.MothersMaiden;
                    empRecord.PreferredLanguage = employeeModel.PreferredLanguage;
                    empRecord.Bloodgroup = employeeModel.Bloodgroup;
                    empRecord.CellNo = employeeModel.CellNo;
                    empRecord.PhoneNo = employeeModel.PhoneNo;
                    empRecord.WhatsAppNo = employeeModel.WhatsAppNo;
                    empRecord.EMail = employeeModel.EMail;
                    empRecord.EmergencySalutation = employeeModel.EmergencySalutation;
                    empRecord.EmergencyFirstName = employeeModel.EmergencyFirstName;
                    empRecord.EmergencyLastName = employeeModel.EmergencyLastName;
                    empRecord.EmergencyContactType = employeeModel.EmergencyContactType;
                    empRecord.EmergencyContactNo = employeeModel.EmergencyContactNo;
                    empRecord.TelephoneNo = employeeModel.TelephoneNo;
                    empRecord.Fax = employeeModel.Fax;
                    empRecord.RelationshipToEmployee = employeeModel.RelationshipToEmployee;
                    empRecord.IsActive = employeeModel.IsActive;
                    empRecord.ModifiedDate = DateTime.Now;
                    empRecord.ModifiedBy = "User";

                    this.uow.GenericRepository<Employee>().Update(empRecord);
                }
                else
                {
                    empRecord.FacilityId = employeeModel.FacilityId;
                    empRecord.RoleId = employeeModel.RoleId;
                    empRecord.EmployeeDepartment = employeeModel.EmployeeDepartment;
                    empRecord.EmployeeCategory = employeeModel.EmployeeCategory;
                    empRecord.EmployeeUserType = employeeModel.EmployeeUserType;
                    empRecord.EmployeeNo = employeeModel.EmployeeNo;
                    empRecord.DOJ = employeeModel.DOJ != null ? this.utilService.GetLocalTime(employeeModel.DOJ.Value) : employeeModel.DOJ;
                    empRecord.SchedulerDepartment = employeeModel.SchedulerDepartment;
                    empRecord.AdditionalInfo = employeeModel.AdditionalInfo;
                    empRecord.EmployeeSalutation = employeeModel.EmployeeSalutation;
                    empRecord.EmployeeFirstName = employeeModel.EmployeeFirstName;
                    empRecord.EmployeeMiddleName = employeeModel.EmployeeMiddleName;
                    empRecord.EmployeeLastName = employeeModel.EmployeeLastName;
                    empRecord.Gender = employeeModel.Gender;
                    empRecord.EmployeeDOB = this.utilService.GetLocalTime(employeeModel.EmployeeDOB);
                    empRecord.EmployeeAge = employeeModel.EmployeeAge;
                    empRecord.EmployeeIdentificationtype1 = employeeModel.EmployeeIdentificationtype1;
                    empRecord.EmployeeIdentificationtype1details = employeeModel.EmployeeIdentificationtype1details;
                    empRecord.EmployeeIdentificationtype2 = employeeModel.EmployeeIdentificationtype2;
                    empRecord.EmployeeIdentificationtype2details = employeeModel.EmployeeIdentificationtype2details;
                    empRecord.MaritalStatus = employeeModel.MaritalStatus;
                    empRecord.MothersMaiden = employeeModel.MothersMaiden;
                    empRecord.PreferredLanguage = employeeModel.PreferredLanguage;
                    empRecord.Bloodgroup = employeeModel.Bloodgroup;
                    empRecord.CellNo = employeeModel.CellNo;
                    empRecord.PhoneNo = employeeModel.PhoneNo;
                    empRecord.WhatsAppNo = employeeModel.WhatsAppNo;
                    empRecord.EMail = employeeModel.EMail;
                    empRecord.EmergencySalutation = employeeModel.EmergencySalutation;
                    empRecord.EmergencyFirstName = employeeModel.EmergencyFirstName;
                    empRecord.EmergencyLastName = employeeModel.EmergencyLastName;
                    empRecord.EmergencyContactType = employeeModel.EmergencyContactType;
                    empRecord.EmergencyContactNo = employeeModel.EmergencyContactNo;
                    empRecord.TelephoneNo = employeeModel.TelephoneNo;
                    empRecord.Fax = employeeModel.Fax;
                    empRecord.RelationshipToEmployee = employeeModel.RelationshipToEmployee;
                    empRecord.IsActive = employeeModel.IsActive;
                    empRecord.ModifiedDate = DateTime.Now;
                    empRecord.ModifiedBy = "User";

                    this.uow.GenericRepository<Employee>().Update(empRecord);
                    this.uow.Save();

                    var oldFacilities = this.GetFacilitiesbyFacilityId(empRecord.FacilityId);

                    var newFacilities = this.GetFacilitiesbyFacilityId(employeeModel.FacilityId);

                    List<int> facilityIds = new List<int>();

                    foreach (var set in oldFacilities)
                    {
                        var record = newFacilities.Where(x => x.FacilityId == set.FacilityId).FirstOrDefault();
                        if (record == null)
                        {
                            facilityIds.Add(set.FacilityId);
                        }
                    }

                    if (facilityIds.Count() > 0)
                    {
                        foreach (var record in facilityIds)
                        {
                            //var proSchedules = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.FacilityID == record & x.ProviderID == empRecord.ProviderID).ToList();
                            //if (proSchedules.Count() > 0)
                            //{
                            //    foreach (var proSched in proSchedules)
                            //    {
                            //        proSched.TerminationDate = DateTime.Now.Date;
                            //        proSched.ModifiedDate = DateTime.Now;
                            //        proSched.ModifiedBy = "User";

                            //        this.uow.GenericRepository<ProviderSchedule>().Update(proSched);
                            //    }
                            //    this.uow.Save();
                            //}
                        }
                    }
                }
            }
            this.uow.Save();
            employeeModel.EmployeeId = empRecord.EmployeeId;
            var status = this.utilService.UpdateGlobalUser(empRecord.EMail, empRecord.UserId);

            if (empRecord.EmployeeId > 0)
            {
                var userRoleData = this.uow.GenericRepository<userrole>().Table().FirstOrDefault(x => x.Userid.ToLower().Trim() == empRecord.UserId.ToLower().Trim());
                if (userRoleData == null)
                {
                    userRoleData = new userrole();

                    userRoleData.Userid = empRecord.UserId;
                    userRoleData.Roleid = empRecord.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Insert(userRoleData);
                }
                else
                {
                    userRoleData.Roleid = empRecord.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Update(userRoleData);
                }
                this.uow.Save();
            }

            if (employeeModel.staffAddressDetails.Count() > 0)
            {
                for (int i = 0; i < employeeModel.staffAddressDetails.Count(); i++)
                {
                    employeeModel.staffAddressDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeAddressInfoModel>();
                var empAddresses = this.uow.GenericRepository<EmployeeAddressInfo>().Table().Where(x => x.EmployeeID == employeeModel.staffAddressDetails.FirstOrDefault().EmployeeID).ToList();

                if (empAddresses.Count() == 0)
                {
                    this.AddUpdateStaffAddressDetails(employeeModel.staffAddressDetails);
                }
                else
                {
                    foreach (var set in empAddresses)
                    {
                        var record = employeeModel.staffAddressDetails.Where(x => x.EmployeeAddressId == set.EmployeeAddressId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeAddressInfo>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffAddressDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffAddressDetails(itemsList);
                }
            }

            if (employeeModel.staffCampusDetails.Count() > 0)
            {
                for (int i = 0; i < employeeModel.staffCampusDetails.Count(); i++)
                {
                    employeeModel.staffCampusDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeCampusModel>();
                var empCampusDetails = this.uow.GenericRepository<EmployeeCampus>().Table().Where(x => x.EmployeeID == employeeModel.staffCampusDetails.FirstOrDefault().EmployeeID).ToList();

                if (empCampusDetails.Count() == 0)
                {
                    this.AddUpdateStaffCampusDetails(employeeModel.staffCampusDetails);
                }
                else
                {
                    foreach (var set in empCampusDetails)
                    {
                        var record = employeeModel.staffCampusDetails.Where(x => x.EmployeeCampusId == set.EmployeeCampusId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeCampus>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffCampusDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffCampusDetails(itemsList);
                }
            }

            if (employeeModel.staffEducationDetails.Count() > 0)
            {
                for (int i = 0; i < employeeModel.staffEducationDetails.Count(); i++)
                {
                    employeeModel.staffEducationDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeEducationInfoModel>();
                var empEducationDetails = this.uow.GenericRepository<EmployeeEducationInfo>().Table().Where(x => x.EmployeeID == employeeModel.staffEducationDetails.FirstOrDefault().EmployeeID).ToList();

                if (empEducationDetails.Count() == 0)
                {
                    this.AddUpdateStaffEducationDetails(employeeModel.staffEducationDetails);
                }
                else
                {
                    foreach (var set in empEducationDetails)
                    {
                        var record = employeeModel.staffEducationDetails.Where(x => x.EmployeeEducationID == set.EmployeeEducationID).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeEducationInfo>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffEducationDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffEducationDetails(itemsList);
                }
            }

            if (employeeModel.staffFamilyDetails.Count() > 0)
            {

                for (int i = 0; i < employeeModel.staffFamilyDetails.Count(); i++)
                {
                    employeeModel.staffFamilyDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeFamilyInfoModel>();
                var empfamilyDetails = this.uow.GenericRepository<EmployeeFamilyInfo>().Table().Where(x => x.EmployeeID == employeeModel.staffFamilyDetails.FirstOrDefault().EmployeeID).ToList();

                if (empfamilyDetails.Count() == 0)
                {
                    this.AddUpdateStaffFamilyDetails(employeeModel.staffFamilyDetails);
                }
                else
                {
                    foreach (var set in empfamilyDetails)
                    {
                        var record = employeeModel.staffFamilyDetails.Where(x => x.EmployeeFamilyID == set.EmployeeFamilyID).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeFamilyInfo>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffFamilyDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffFamilyDetails(itemsList);
                }
            }

            if (employeeModel.staffHobbyDetails.Count() > 0)
            {

                for (int i = 0; i < employeeModel.staffHobbyDetails.Count(); i++)
                {
                    employeeModel.staffHobbyDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeHobbyInfoModel>();
                var empHobbyDetails = this.uow.GenericRepository<EmployeeHobbyInfo>().Table().Where(x => x.EmployeeID == employeeModel.staffHobbyDetails.FirstOrDefault().EmployeeID).ToList();

                if (empHobbyDetails.Count() == 0)
                {
                    this.AddUpdateStaffHobbyDetails(employeeModel.staffHobbyDetails);
                }
                else
                {
                    foreach (var set in empHobbyDetails)
                    {
                        var record = employeeModel.staffHobbyDetails.Where(x => x.EmployeeHobbyId == set.EmployeeHobbyId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeHobbyInfo>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffHobbyDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffHobbyDetails(itemsList);
                }
            }

            if (employeeModel.staffLanguageDetails.Count() > 0)
            {

                for (int i = 0; i < employeeModel.staffLanguageDetails.Count(); i++)
                {
                    employeeModel.staffLanguageDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeLanguageInfoModel>();
                var empLanguages = this.uow.GenericRepository<EmployeeLanguageInfo>().Table().Where(x => x.EmployeeID == employeeModel.staffLanguageDetails.FirstOrDefault().EmployeeID).ToList();

                if (empLanguages.Count() == 0)
                {
                    this.AddUpdateStaffLanguageDetails(employeeModel.staffLanguageDetails);
                }
                else
                {
                    foreach (var set in empLanguages)
                    {
                        var record = employeeModel.staffLanguageDetails.Where(x => x.EmployeeLanguageID == set.EmployeeLanguageID).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeLanguageInfo>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffLanguageDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffLanguageDetails(itemsList);
                }
            }

            if (employeeModel.staffWorkDetails.Count() > 0)
            {

                for (int i = 0; i < employeeModel.staffWorkDetails.Count(); i++)
                {
                    employeeModel.staffWorkDetails[i].EmployeeID = empRecord.EmployeeId;
                }

                var itemsList = new List<EmployeeWorkHistoryModel>();
                var empWorks = this.uow.GenericRepository<EmployeeWorkHistory>().Table().Where(x => x.EmployeeID == employeeModel.staffWorkDetails.FirstOrDefault().EmployeeID).ToList();

                if (empWorks.Count() == 0)
                {
                    this.AddUpdateStaffWorkHistoryDetails(employeeModel.staffWorkDetails);
                }
                else
                {
                    foreach (var set in empWorks)
                    {
                        var record = employeeModel.staffWorkDetails.Where(x => x.EmployeeWorkHistoryId == set.EmployeeWorkHistoryId).FirstOrDefault();
                        if (record == null)
                        {
                            this.uow.GenericRepository<EmployeeWorkHistory>().Delete(set);
                        }
                        else
                        {
                            itemsList.Add(record);
                        }
                    }
                    this.uow.Save();

                    foreach (var Set in employeeModel.staffWorkDetails)
                    {
                        if (!itemsList.Contains(Set))
                        {
                            itemsList.Add(Set);
                        }
                    }
                    this.AddUpdateStaffWorkHistoryDetails(itemsList);
                }
            }

            return employeeModel;
        }

        ///// <summary>
        ///// Add or Update Staff Address details
        ///// </summary>
        ///// <param>List<EmployeeAddressInfoModel> addressCollection</param>
        ///// <returns>List<EmployeeAddressInfoModel>. if Staff(Employee) Address details added = success. else = failure</returns>
        public List<EmployeeAddressInfoModel> AddUpdateStaffAddressDetails(List<EmployeeAddressInfoModel> addressCollection)
        {
            var staffAddresses = this.uow.GenericRepository<EmployeeAddressInfo>().Table().Where(x => x.EmployeeID == addressCollection.FirstOrDefault().EmployeeID).ToList();

            EmployeeAddressInfo addressInfo = new EmployeeAddressInfo();

            foreach (var record in addressCollection)
            {
                addressInfo = this.uow.GenericRepository<EmployeeAddressInfo>().Table().FirstOrDefault(x => x.EmployeeAddressId == record.EmployeeAddressId);
                if (addressInfo == null)
                {
                    addressInfo = new EmployeeAddressInfo();

                    addressInfo.EmployeeID = record.EmployeeID;
                    addressInfo.AddressType = record.AddressType;
                    addressInfo.Address1 = record.Address1;
                    addressInfo.Address2 = record.Address2;
                    addressInfo.City = record.City;
                    addressInfo.District = record.District;
                    addressInfo.Pincode = record.Pincode;
                    addressInfo.State = record.State;
                    addressInfo.Country = record.Country;
                    addressInfo.ValidFrom = record.ValidFrom != null ? this.utilService.GetLocalTime(record.ValidFrom.Value) : record.ValidFrom;
                    addressInfo.ValidTo = record.ValidTo != null ? this.utilService.GetLocalTime(record.ValidTo.Value) : record.ValidTo;
                    addressInfo.Createddate = DateTime.Now;
                    addressInfo.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeAddressInfo>().Insert(addressInfo);
                }
                else
                {
                    addressInfo.AddressType = record.AddressType;
                    addressInfo.Address1 = record.Address1;
                    addressInfo.Address2 = record.Address2;
                    addressInfo.City = record.City;
                    addressInfo.District = record.District;
                    addressInfo.Pincode = record.Pincode;
                    addressInfo.State = record.State;
                    addressInfo.Country = record.Country;
                    addressInfo.ValidFrom = record.ValidFrom != null ? this.utilService.GetLocalTime(record.ValidFrom.Value) : record.ValidFrom;
                    addressInfo.ValidTo = record.ValidTo != null ? this.utilService.GetLocalTime(record.ValidTo.Value) : record.ValidTo;
                    addressInfo.ModifiedDate = DateTime.Now;
                    addressInfo.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeAddressInfo>().Update(addressInfo);
                }
                this.uow.Save();
                record.EmployeeAddressId = addressInfo.EmployeeAddressId;
            }
            return addressCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Campus details
        ///// </summary>
        ///// <param>List<EmployeeCampusModel> campusCollection</param>
        ///// <returns>List<EmployeeCampusModel>. if Staff(Employee) Campus details added = success. else = failure</returns>
        public List<EmployeeCampusModel> AddUpdateStaffCampusDetails(List<EmployeeCampusModel> campusCollection)
        {
            EmployeeCampus campusData = new EmployeeCampus();

            foreach (var record in campusCollection)
            {
                campusData = this.uow.GenericRepository<EmployeeCampus>().Table().FirstOrDefault(x => x.EmployeeCampusId == record.EmployeeCampusId);
                if (campusData == null)
                {
                    campusData = new EmployeeCampus();

                    campusData.EmployeeID = record.EmployeeID;
                    campusData.Name = record.Name;
                    campusData.CampusDate = record.CampusDate != null ? this.utilService.GetLocalTime(record.CampusDate.Value) : record.CampusDate;
                    campusData.Details = record.Details;
                    campusData.CreatedDate = DateTime.Now;
                    campusData.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeCampus>().Insert(campusData);
                }
                else
                {
                    campusData.Name = record.Name;
                    campusData.CampusDate = record.CampusDate != null ? this.utilService.GetLocalTime(record.CampusDate.Value) : record.CampusDate;
                    campusData.Details = record.Details;
                    campusData.ModifiedDate = DateTime.Now;
                    campusData.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeCampus>().Update(campusData);
                }
                this.uow.Save();
                record.EmployeeCampusId = campusData.EmployeeCampusId;
            }

            return campusCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Education details
        ///// </summary>
        ///// <param>List<EmployeeEducationInfoModel> educationCollection</param>
        ///// <returns>List<EmployeeEducationInfoModel>. if Staff(Employee) Education details added = success. else = failure</returns>
        public List<EmployeeEducationInfoModel> AddUpdateStaffEducationDetails(List<EmployeeEducationInfoModel> educationCollection)
        {
            EmployeeEducationInfo education = new EmployeeEducationInfo();

            foreach (var record in educationCollection)
            {
                education = this.uow.GenericRepository<EmployeeEducationInfo>().Table().FirstOrDefault(x => x.EmployeeEducationID == record.EmployeeEducationID);
                if (education == null)
                {
                    education = new EmployeeEducationInfo();

                    education.EmployeeID = record.EmployeeID;
                    education.University = record.University;
                    education.Month = record.Month;
                    education.Year = record.Year;
                    education.InstituteName = record.InstituteName;
                    education.Percentage = record.Percentage;
                    education.Branch = record.Branch;
                    education.MainSubject = record.MainSubject;
                    education.Scholorship = record.Scholorship;
                    education.Qualification = record.Qualification;
                    education.Duration = record.Duration;
                    education.PlaceOfInstitute = record.PlaceOfInstitute;
                    education.RegistrationAuthority = record.RegistrationAuthority;
                    education.RegistrationNo = record.RegistrationNo;
                    education.RegistrationExpiryDate = record.RegistrationExpiryDate != null ? this.utilService.GetLocalTime(record.RegistrationExpiryDate.Value) : record.RegistrationExpiryDate;
                    education.AdditionalInfo = record.AdditionalInfo;
                    education.Createddate = DateTime.Now;
                    education.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeEducationInfo>().Insert(education);
                }
                else
                {
                    education.University = record.University;
                    education.Month = record.Month;
                    education.Year = record.Year;
                    education.InstituteName = record.InstituteName;
                    education.Percentage = record.Percentage;
                    education.Branch = record.Branch;
                    education.MainSubject = record.MainSubject;
                    education.Scholorship = record.Scholorship;
                    education.Qualification = record.Qualification;
                    education.Duration = record.Duration;
                    education.PlaceOfInstitute = record.PlaceOfInstitute;
                    education.RegistrationAuthority = record.RegistrationAuthority;
                    education.RegistrationNo = record.RegistrationNo;
                    education.RegistrationExpiryDate = record.RegistrationExpiryDate != null ? this.utilService.GetLocalTime(record.RegistrationExpiryDate.Value) : record.RegistrationExpiryDate;
                    education.AdditionalInfo = record.AdditionalInfo;
                    education.ModifiedDate = DateTime.Now;
                    education.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeEducationInfo>().Update(education);
                }
                this.uow.Save();
                record.EmployeeEducationID = education.EmployeeEducationID;
            }

            return educationCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Family details
        ///// </summary>
        ///// <param>List<EmployeeFamilyInfoModel> familyCollection</param>
        ///// <returns>List<EmployeeFamilyInfoModel>. if Staff(Employee) Family details added = success. else = failure</returns>
        public List<EmployeeFamilyInfoModel> AddUpdateStaffFamilyDetails(List<EmployeeFamilyInfoModel> familyCollection)
        {
            EmployeeFamilyInfo familyInfo = new EmployeeFamilyInfo();

            foreach (var record in familyCollection)
            {
                familyInfo = this.uow.GenericRepository<EmployeeFamilyInfo>().Table().FirstOrDefault(x => x.EmployeeFamilyID == record.EmployeeFamilyID);
                if (familyInfo == null)
                {
                    familyInfo = new EmployeeFamilyInfo();

                    familyInfo.EmployeeID = record.EmployeeID;
                    familyInfo.Salutation = record.Salutation;
                    familyInfo.FirstName = record.FirstName;
                    familyInfo.MiddleName = record.MiddleName;
                    familyInfo.LastName = record.LastName;
                    familyInfo.Gender = record.Gender;
                    familyInfo.Age = record.Age;
                    familyInfo.CellNo = record.CellNo;
                    familyInfo.PhoneNo = record.PhoneNo;
                    familyInfo.WhatsAppNo = record.WhatsAppNo;
                    familyInfo.EMail = record.EMail;
                    familyInfo.RelationshipToEmployee = record.RelationshipToEmployee;
                    familyInfo.Occupation = record.Occupation;
                    familyInfo.AdditionalInfo = record.AdditionalInfo;
                    familyInfo.Createddate = DateTime.Now;
                    familyInfo.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeFamilyInfo>().Insert(familyInfo);
                }
                else
                {
                    familyInfo.Salutation = record.Salutation;
                    familyInfo.FirstName = record.FirstName;
                    familyInfo.MiddleName = record.MiddleName;
                    familyInfo.LastName = record.LastName;
                    familyInfo.Gender = record.Gender;
                    familyInfo.Age = record.Age;
                    familyInfo.CellNo = record.CellNo;
                    familyInfo.PhoneNo = record.PhoneNo;
                    familyInfo.WhatsAppNo = record.WhatsAppNo;
                    familyInfo.EMail = record.EMail;
                    familyInfo.RelationshipToEmployee = record.RelationshipToEmployee;
                    familyInfo.Occupation = record.Occupation;
                    familyInfo.AdditionalInfo = record.AdditionalInfo;
                    familyInfo.ModifiedDate = DateTime.Now;
                    familyInfo.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeFamilyInfo>().Update(familyInfo);
                }
                this.uow.Save();
                record.EmployeeFamilyID = familyInfo.EmployeeFamilyID;
            }

            return familyCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Hobby details
        ///// </summary>
        ///// <param>List<EmployeeHobbyInfoModel> hobbyCollection</param>
        ///// <returns>List<EmployeeHobbyInfoModel>. if Staff(Employee) Hobby details added = success. else = failure</returns>
        public List<EmployeeHobbyInfoModel> AddUpdateStaffHobbyDetails(List<EmployeeHobbyInfoModel> hobbyCollection)
        {
            EmployeeHobbyInfo hobbyInfo = new EmployeeHobbyInfo();

            foreach (var record in hobbyCollection)
            {
                hobbyInfo = this.uow.GenericRepository<EmployeeHobbyInfo>().Table().FirstOrDefault(x => x.EmployeeHobbyId == record.EmployeeHobbyId);
                if (hobbyInfo == null)
                {
                    hobbyInfo = new EmployeeHobbyInfo();

                    hobbyInfo.EmployeeID = record.EmployeeID;
                    hobbyInfo.ActivityType = record.ActivityType;
                    hobbyInfo.Details = record.Details;
                    hobbyInfo.CreatedDate = DateTime.Now;
                    hobbyInfo.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeHobbyInfo>().Insert(hobbyInfo);
                }
                else
                {
                    hobbyInfo.ActivityType = record.ActivityType;
                    hobbyInfo.Details = record.Details;
                    hobbyInfo.ModifiedDate = DateTime.Now;
                    hobbyInfo.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeHobbyInfo>().Update(hobbyInfo);
                }
                this.uow.Save();
                record.EmployeeHobbyId = hobbyInfo.EmployeeHobbyId;
            }

            return hobbyCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Language details
        ///// </summary>
        ///// <param>List<EmployeeLanguageInfoModel> languageCollection</param>
        ///// <returns>List<EmployeeLanguageInfoModel>. if Staff(Employee) Language details added = success. else = failure</returns>
        public List<EmployeeLanguageInfoModel> AddUpdateStaffLanguageDetails(List<EmployeeLanguageInfoModel> languageCollection)
        {
            EmployeeLanguageInfo languageInfo = new EmployeeLanguageInfo();

            foreach (var record in languageCollection)
            {
                languageInfo = this.uow.GenericRepository<EmployeeLanguageInfo>().Table().FirstOrDefault(x => x.EmployeeLanguageID == record.EmployeeLanguageID);
                if (languageInfo == null)
                {
                    languageInfo = new EmployeeLanguageInfo();

                    languageInfo.EmployeeID = record.EmployeeID;
                    languageInfo.Language = record.Language;
                    languageInfo.IsSpeak = record.IsSpeak;
                    languageInfo.SpeakingLevel = record.SpeakingLevel;
                    languageInfo.IsRead = record.IsRead;
                    languageInfo.ReadingLevel = record.ReadingLevel;
                    languageInfo.IsWrite = record.IsWrite;
                    languageInfo.WritingLevel = record.WritingLevel;
                    languageInfo.CreatedDate = DateTime.Now;
                    languageInfo.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeLanguageInfo>().Insert(languageInfo);
                }
                else
                {
                    languageInfo.Language = record.Language;
                    languageInfo.IsSpeak = record.IsSpeak;
                    languageInfo.SpeakingLevel = record.SpeakingLevel;
                    languageInfo.IsRead = record.IsRead;
                    languageInfo.ReadingLevel = record.ReadingLevel;
                    languageInfo.IsWrite = record.IsWrite;
                    languageInfo.WritingLevel = record.WritingLevel;
                    languageInfo.ModifiedDate = DateTime.Now;
                    languageInfo.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeLanguageInfo>().Update(languageInfo);
                }
                this.uow.Save();
                record.EmployeeLanguageID = languageInfo.EmployeeLanguageID;
            }

            return languageCollection;
        }

        ///// <summary>
        ///// Add or Update Staff Work details
        ///// </summary>
        ///// <param>List<EmployeeWorkHistoryModel> workCollection</param>
        ///// <returns>List<EmployeeWorkHistoryModel>. if Staff(Employee) Work details added = success. else = failure</returns>
        public List<EmployeeWorkHistoryModel> AddUpdateStaffWorkHistoryDetails(List<EmployeeWorkHistoryModel> workCollection)
        {
            EmployeeWorkHistory workHistory = new EmployeeWorkHistory();

            foreach (var record in workCollection)
            {
                workHistory = this.uow.GenericRepository<EmployeeWorkHistory>().Table().FirstOrDefault(x => x.EmployeeWorkHistoryId == record.EmployeeWorkHistoryId);
                if (workHistory == null)
                {
                    workHistory = new EmployeeWorkHistory();

                    workHistory.EmployeeID = record.EmployeeID;
                    workHistory.EmployerName = record.EmployerName;
                    workHistory.ContactPerson = record.ContactPerson;
                    workHistory.EMail = record.EMail;
                    workHistory.CellNo = record.CellNo;
                    workHistory.PhoneNo = record.PhoneNo;
                    workHistory.Address1 = record.Address1;
                    workHistory.Address2 = record.Address2;
                    workHistory.Town = record.Town;
                    workHistory.City = record.City;
                    workHistory.District = record.District;
                    workHistory.State = record.State;
                    workHistory.Country = record.Country;
                    workHistory.Pincode = record.Pincode;
                    workHistory.FromDate = record.FromDate != null ? this.utilService.GetLocalTime(record.FromDate.Value) : record.FromDate;
                    workHistory.ToDate = record.ToDate != null ? this.utilService.GetLocalTime(record.ToDate.Value) : record.ToDate;
                    workHistory.AdditionalInfo = record.AdditionalInfo;
                    workHistory.Createddate = DateTime.Now;
                    workHistory.CreatedBy = "User";

                    this.uow.GenericRepository<EmployeeWorkHistory>().Insert(workHistory);
                }
                else
                {
                    workHistory.EmployerName = record.EmployerName;
                    workHistory.ContactPerson = record.ContactPerson;
                    workHistory.EMail = record.EMail;
                    workHistory.CellNo = record.CellNo;
                    workHistory.PhoneNo = record.PhoneNo;
                    workHistory.Address1 = record.Address1;
                    workHistory.Address2 = record.Address2;
                    workHistory.Town = record.Town;
                    workHistory.City = record.City;
                    workHistory.District = record.District;
                    workHistory.State = record.State;
                    workHistory.Country = record.Country;
                    workHistory.Pincode = record.Pincode;
                    workHistory.FromDate = record.FromDate != null ? this.utilService.GetLocalTime(record.FromDate.Value) : record.FromDate;
                    workHistory.ToDate = record.ToDate != null ? this.utilService.GetLocalTime(record.ToDate.Value) : record.ToDate;
                    workHistory.AdditionalInfo = record.AdditionalInfo;
                    workHistory.ModifiedDate = DateTime.Now;
                    workHistory.ModifiedBy = "User";

                    this.uow.GenericRepository<EmployeeWorkHistory>().Update(workHistory);
                }
                this.uow.Save();
                record.EmployeeWorkHistoryId = workHistory.EmployeeWorkHistoryId;
            }

            return workCollection;
        }



        ///// <summary>
        ///// Get all Employee data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<EmployeeNewModel>. if collection of Employee data = success. else = failure</returns>
        public List<EmployeeNewModel> GetStaffs()
        {
            List<EmployeeNewModel> emp = new List<EmployeeNewModel>();

            var emply = (from e in this.uow.GenericRepository<Employee>().Table()
                         select e).ToList();

            foreach (var data in emply)
            {
                var fac = (data.FacilityId != null && data.FacilityId != "") ? data.FacilityId : "";
                EmployeeNewModel empModel = new EmployeeNewModel();

                empModel.EmployeeId = data.EmployeeId;
                empModel.UserId = data.UserId;
                empModel.FacilityId = data.FacilityId;
                empModel.RoleId = data.RoleId;
                empModel.RoleDesc = data.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().FirstOrDefault(x => x.RoleId == data.RoleId).RoleDescription : "";
                empModel.EmployeeDepartment = data.EmployeeDepartment;
                empModel.EmployeeDepartmentDesc = data.EmployeeDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.EmployeeDepartment).DepartmentDesc : "";
                empModel.EmployeeCategory = data.EmployeeCategory;
                //empModel.EmployeeCategoryDesc = data.EmployeeCategory > 0 ? this.uow.GenericRepository<Category>().Table().FirstOrDefault(x => x.CategoryId == data.EmployeeCategory).CategoryDescription : "";
                empModel.EmployeeUserType = data.EmployeeUserType;
                //empModel.EmployeeUserTypeDesc = data.EmployeeUserType > 0 ? this.uow.GenericRepository<UserType>().Table().FirstOrDefault(x => x.UserTypeId == data.EmployeeUserType).EmployeeUserTypeDescription : "";
                empModel.EmployeeNo = data.EmployeeNo;
                empModel.DOJ = data.DOJ;
                empModel.SchedulerDepartment = data.SchedulerDepartment;
                empModel.SchedulerDepartmentDesc = data.SchedulerDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.SchedulerDepartment).DepartmentDesc : "";
                empModel.AdditionalInfo = data.AdditionalInfo;
                empModel.EmployeeSalutation = data.EmployeeSalutation;
                empModel.EmployeeSalutationDesc = data.EmployeeSalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmployeeSalutation).SalutationDesc : "";
                empModel.EmployeeFirstName = data.EmployeeFirstName;
                empModel.EmployeeMiddleName = data.EmployeeMiddleName;
                empModel.EmployeeLastName = data.EmployeeLastName;
                empModel.EmployeeFullname = data.EmployeeFirstName + " " + data.EmployeeMiddleName + " " + data.EmployeeLastName;
                empModel.Gender = data.Gender;
                empModel.GenderDesc = data.Gender > 0 ? this.uow.GenericRepository<Gender>().Table().FirstOrDefault(x => x.GenderID == data.Gender).GenderDesc : "";
                empModel.EmployeeDOB = data.EmployeeDOB;
                empModel.EmployeeAge = data.EmployeeAge;
                empModel.EmployeeIdentificationtype1 = data.EmployeeIdentificationtype1;
                empModel.EmployeeIdentificationtype1details = data.EmployeeIdentificationtype1details;
                empModel.EmployeeIdentificationtype2 = data.EmployeeIdentificationtype2;
                empModel.EmployeeIdentificationtype2details = data.EmployeeIdentificationtype2details;
                empModel.MaritalStatus = data.MaritalStatus;
                empModel.MothersMaiden = data.MothersMaiden;
                empModel.PreferredLanguage = data.PreferredLanguage;
                empModel.Languages = (data.PreferredLanguage != null && data.PreferredLanguage != "") ?
                                    (data.PreferredLanguage.Contains(",") ? this.GetLanguagesforEmployee(data.PreferredLanguage)
                                    : this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(data.PreferredLanguage)).LanguageDescription) : "";
                empModel.LanguageArray = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageArrayforEmployee(data.PreferredLanguage) : new List<int>();
                empModel.LanguageList = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageListforEmployee(data.PreferredLanguage) : new List<string>();
                empModel.Bloodgroup = data.Bloodgroup;
                empModel.CellNo = data.CellNo;
                empModel.PhoneNo = data.PhoneNo;
                empModel.WhatsAppNo = data.WhatsAppNo;
                empModel.EMail = data.EMail;
                empModel.EmergencySalutation = data.EmergencySalutation;
                empModel.EmergencySalutationDesc = data.EmergencySalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmergencySalutation).SalutationDesc : "";
                empModel.EmergencyFirstName = data.EmergencyFirstName;
                empModel.EmergencyLastName = data.EmergencyLastName;
                empModel.EmergencyContactType = data.EmergencyContactType;
                empModel.EmergencyContactTypeDesc = data.EmergencyContactType > 0 ? this.uow.GenericRepository<ContactType>().Table().FirstOrDefault(x => x.ContactTypeId == data.EmergencyContactType).ContactTypeDesc : "";
                empModel.EmergencyContactNo = data.EmergencyContactNo;
                empModel.TelephoneNo = data.TelephoneNo;
                empModel.Fax = data.Fax;
                empModel.RelationshipToEmployee = data.RelationshipToEmployee;
                empModel.RelationshipToEmployeeDesc = data.RelationshipToEmployee > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == data.RelationshipToEmployee).RSPDescription : "";
                empModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforEmployee(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                empModel.FacilityArray = fac != "" ? this.GetFacilityArrayforEmployee(fac) : new List<int>();
                empModel.IsActive = data.IsActive;
                empModel.staffAddressDetails = this.GetStaffAddressdetails(data.EmployeeId);
                empModel.staffCampusDetails = this.GetStaffCampusDetails(data.EmployeeId);
                empModel.staffEducationDetails = this.GetStaffEducationDetails(data.EmployeeId);
                empModel.staffFamilyDetails = this.GetStaffFamilyDetails(data.EmployeeId);
                empModel.staffHobbyDetails = this.GetStaffHobbyDetails(data.EmployeeId);
                empModel.staffLanguageDetails = this.GetStaffLanguageDetails(data.EmployeeId);
                empModel.staffWorkDetails = this.GetStaffWorkHistoryDetails(data.EmployeeId);
                empModel.StaffFile = this.GetFile(data.EmployeeId.ToString(), "Staff").Count() > 0 ? this.GetFile(data.EmployeeId.ToString(), "Staff") : new List<clsViewFile>();

                if (!emp.Contains(empModel))
                {
                    emp.Add(empModel);
                }
            }

            List<EmployeeNewModel> StaffList = new List<EmployeeNewModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            foreach (var empData in emp)
            {
                var empFacilities = this.utilService.GetFacilitiesbyEmployeeId(empData.EmployeeId);
                if (facList.Count() > 0)
                {
                    foreach (var fac in facList)
                    {
                        var record = empFacilities.Where(x => x.FacilityId == fac.FacilityId).FirstOrDefault();
                        if (record != null && !(StaffList.Contains(empData)))
                        {
                            StaffList.Add(empData);
                        }
                    }
                }
                else
                {
                    if (!StaffList.Contains(empData))
                    {
                        StaffList.Add(empData);
                    }
                }
            }

            return StaffList;
        }

        ///// <summary>
        ///// Get Employee data by Id
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>EmployeeNewModel. if collection of Employee data = success. else = failure</returns>
        public EmployeeNewModel GetStaffbyId(int employeeId)
        {
            var data = this.uow.GenericRepository<Employee>().Table().Where(x => x.EmployeeId == employeeId).FirstOrDefault();

            EmployeeNewModel empModel = new EmployeeNewModel();
            if (data != null)
            {
                var fac = (data.FacilityId != null && data.FacilityId != "") ? data.FacilityId : "";
                empModel.EmployeeId = data.EmployeeId;
                empModel.UserId = data.UserId;
                empModel.FacilityId = data.FacilityId;
                empModel.RoleId = data.RoleId;
                empModel.RoleDesc = data.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().FirstOrDefault(x => x.RoleId == data.RoleId).RoleDescription : "";
                empModel.EmployeeDepartment = data.EmployeeDepartment;
                empModel.EmployeeDepartmentDesc = data.EmployeeDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.EmployeeDepartment).DepartmentDesc : "";
                empModel.EmployeeCategory = data.EmployeeCategory;
                //empModel.EmployeeCategoryDesc = data.EmployeeCategory > 0 ? this.uow.GenericRepository<Category>().Table().FirstOrDefault(x => x.CategoryId == data.EmployeeCategory).CategoryDescription : "";
                empModel.EmployeeUserType = data.EmployeeUserType;
                //empModel.EmployeeUserTypeDesc = data.EmployeeUserType > 0 ? this.uow.GenericRepository<UserType>().Table().FirstOrDefault(x => x.UserTypeId == data.EmployeeUserType).EmployeeUserTypeDescription : "";
                empModel.EmployeeNo = data.EmployeeNo;
                empModel.DOJ = data.DOJ;
                empModel.SchedulerDepartment = data.SchedulerDepartment;
                empModel.SchedulerDepartmentDesc = data.SchedulerDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.SchedulerDepartment).DepartmentDesc : "";
                empModel.AdditionalInfo = data.AdditionalInfo;
                empModel.EmployeeSalutation = data.EmployeeSalutation;
                empModel.EmployeeSalutationDesc = data.EmployeeSalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmployeeSalutation).SalutationDesc : "";
                empModel.EmployeeFirstName = data.EmployeeFirstName;
                empModel.EmployeeMiddleName = data.EmployeeMiddleName;
                empModel.EmployeeLastName = data.EmployeeLastName;
                empModel.EmployeeFullname = data.EmployeeFirstName + "" + data.EmployeeMiddleName + "" + data.EmployeeLastName;
                empModel.Gender = data.Gender;
                empModel.GenderDesc = data.Gender > 0 ? this.uow.GenericRepository<Gender>().Table().FirstOrDefault(x => x.GenderID == data.Gender).GenderDesc : "";
                empModel.EmployeeDOB = data.EmployeeDOB;
                empModel.EmployeeAge = data.EmployeeAge;
                empModel.EmployeeIdentificationtype1 = data.EmployeeIdentificationtype1;
                empModel.EmployeeIdentificationtype1details = data.EmployeeIdentificationtype1details;
                empModel.EmployeeIdentificationtype2 = data.EmployeeIdentificationtype2;
                empModel.EmployeeIdentificationtype2details = data.EmployeeIdentificationtype2details;
                empModel.MaritalStatus = data.MaritalStatus;
                empModel.MothersMaiden = data.MothersMaiden;
                empModel.PreferredLanguage = data.PreferredLanguage;
                empModel.Languages = (data.PreferredLanguage != null && data.PreferredLanguage != "") ?
                                    (data.PreferredLanguage.Contains(",") ? this.GetLanguagesforEmployee(data.PreferredLanguage)
                                    : this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(data.PreferredLanguage)).LanguageDescription) : "";
                empModel.LanguageArray = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageArrayforEmployee(data.PreferredLanguage) : new List<int>();
                empModel.LanguageList = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageListforEmployee(data.PreferredLanguage) : new List<string>();
                empModel.Bloodgroup = data.Bloodgroup;
                empModel.CellNo = data.CellNo;
                empModel.PhoneNo = data.PhoneNo;
                empModel.WhatsAppNo = data.WhatsAppNo;
                empModel.EMail = data.EMail;
                empModel.EmergencySalutation = data.EmergencySalutation;
                empModel.EmergencySalutationDesc = data.EmergencySalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmergencySalutation).SalutationDesc : "";
                empModel.EmergencyFirstName = data.EmergencyFirstName;
                empModel.EmergencyLastName = data.EmergencyLastName;
                empModel.EmergencyContactType = data.EmergencyContactType;
                empModel.EmergencyContactTypeDesc = data.EmergencyContactType > 0 ? this.uow.GenericRepository<ContactType>().Table().FirstOrDefault(x => x.ContactTypeId == data.EmergencyContactType).ContactTypeDesc : "";
                empModel.EmergencyContactNo = data.EmergencyContactNo;
                empModel.TelephoneNo = data.TelephoneNo;
                empModel.Fax = data.Fax;
                empModel.RelationshipToEmployee = data.RelationshipToEmployee;
                empModel.RelationshipToEmployeeDesc = data.RelationshipToEmployee > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == data.RelationshipToEmployee).RSPDescription : "";
                empModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforEmployee(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                empModel.FacilityArray = fac != "" ? this.GetFacilityArrayforEmployee(fac) : new List<int>();
                empModel.IsActive = data.IsActive;
                empModel.staffAddressDetails = this.GetStaffAddressdetails(data.EmployeeId);
                empModel.staffCampusDetails = this.GetStaffCampusDetails(data.EmployeeId);
                empModel.staffEducationDetails = this.GetStaffEducationDetails(data.EmployeeId);
                empModel.staffFamilyDetails = this.GetStaffFamilyDetails(data.EmployeeId);
                empModel.staffHobbyDetails = this.GetStaffHobbyDetails(data.EmployeeId);
                empModel.staffLanguageDetails = this.GetStaffLanguageDetails(data.EmployeeId);
                empModel.staffWorkDetails = this.GetStaffWorkHistoryDetails(data.EmployeeId);
                empModel.StaffFile = this.GetFile(data.EmployeeId.ToString(), "Staff").Count() > 0 ? this.GetFile(data.EmployeeId.ToString(), "Staff") : new List<clsViewFile>();

                if (empModel.StaffFile.Count() > 0)
                {
                    //byte[] bytes = System.IO.File.ReadAllBytes(empModel.StaffFile.FirstOrDefault().FileUrl);
                    //empModel.StaffImage = Convert.ToBase64String(bytes);
                    empModel.StaffImage = empModel.StaffFile.FirstOrDefault().ActualFile;
                }
            }

            return empModel;
        }

        ///// <summary>
        ///// Get Employee data by User Id
        ///// </summary>
        ///// <param>string UserId</param>
        ///// <returns>EmployeeNewModel. if collection of Employee data = success. else = failure</returns>
        public EmployeeNewModel GetStaffbyUserId(string UserId)
        {
            var data = this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == UserId.ToLower().Trim()).FirstOrDefault();

            EmployeeNewModel empModel = new EmployeeNewModel();
            if (data != null)
            {
                var fac = (data.FacilityId != null && data.FacilityId != "") ? data.FacilityId : "";
                empModel.EmployeeId = data.EmployeeId;
                empModel.UserId = data.UserId;
                empModel.FacilityId = data.FacilityId;
                empModel.RoleId = data.RoleId;
                empModel.RoleDesc = data.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().FirstOrDefault(x => x.RoleId == data.RoleId).RoleDescription : "";
                empModel.EmployeeDepartment = data.EmployeeDepartment;
                empModel.EmployeeDepartmentDesc = data.EmployeeDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.EmployeeDepartment).DepartmentDesc : "";
                empModel.EmployeeCategory = data.EmployeeCategory;
                //empModel.EmployeeCategoryDesc = data.EmployeeCategory > 0 ? this.uow.GenericRepository<Category>().Table().FirstOrDefault(x => x.CategoryId == data.EmployeeCategory).CategoryDescription : "";
                empModel.EmployeeUserType = data.EmployeeUserType;
                //empModel.EmployeeUserTypeDesc = data.EmployeeUserType > 0 ? this.uow.GenericRepository<UserType>().Table().FirstOrDefault(x => x.UserTypeId == data.EmployeeUserType).EmployeeUserTypeDescription : "";
                empModel.EmployeeNo = data.EmployeeNo;
                empModel.DOJ = data.DOJ;
                empModel.SchedulerDepartment = data.SchedulerDepartment;
                empModel.SchedulerDepartmentDesc = data.SchedulerDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.SchedulerDepartment).DepartmentDesc : "";
                empModel.AdditionalInfo = data.AdditionalInfo;
                empModel.EmployeeSalutation = data.EmployeeSalutation;
                empModel.EmployeeSalutationDesc = data.EmployeeSalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmployeeSalutation).SalutationDesc : "";
                empModel.EmployeeFirstName = data.EmployeeFirstName;
                empModel.EmployeeMiddleName = data.EmployeeMiddleName;
                empModel.EmployeeLastName = data.EmployeeLastName;
                empModel.EmployeeFullname = data.EmployeeFirstName + "" + data.EmployeeMiddleName + "" + data.EmployeeLastName;
                empModel.Gender = data.Gender;
                empModel.GenderDesc = data.Gender > 0 ? this.uow.GenericRepository<Gender>().Table().FirstOrDefault(x => x.GenderID == data.Gender).GenderDesc : "";
                empModel.EmployeeDOB = data.EmployeeDOB;
                empModel.EmployeeAge = data.EmployeeAge;
                empModel.EmployeeIdentificationtype1 = data.EmployeeIdentificationtype1;
                empModel.EmployeeIdentificationtype1details = data.EmployeeIdentificationtype1details;
                empModel.EmployeeIdentificationtype2 = data.EmployeeIdentificationtype2;
                empModel.EmployeeIdentificationtype2details = data.EmployeeIdentificationtype2details;
                empModel.MaritalStatus = data.MaritalStatus;
                empModel.MothersMaiden = data.MothersMaiden;
                empModel.PreferredLanguage = data.PreferredLanguage;
                empModel.Languages = (data.PreferredLanguage != null && data.PreferredLanguage != "") ?
                                    (data.PreferredLanguage.Contains(",") ? this.GetLanguagesforEmployee(data.PreferredLanguage)
                                    : this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(data.PreferredLanguage)).LanguageDescription) : "";
                empModel.LanguageArray = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageArrayforEmployee(data.PreferredLanguage) : new List<int>();
                empModel.LanguageList = (data.PreferredLanguage != null && data.PreferredLanguage != "") ? this.GetLanguageListforEmployee(data.PreferredLanguage) : new List<string>();
                empModel.Bloodgroup = data.Bloodgroup;
                empModel.CellNo = data.CellNo;
                empModel.PhoneNo = data.PhoneNo;
                empModel.WhatsAppNo = data.WhatsAppNo;
                empModel.EMail = data.EMail;
                empModel.EmergencySalutation = data.EmergencySalutation;
                empModel.EmergencySalutationDesc = data.EmergencySalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmergencySalutation).SalutationDesc : "";
                empModel.EmergencyFirstName = data.EmergencyFirstName;
                empModel.EmergencyLastName = data.EmergencyLastName;
                empModel.EmergencyContactType = data.EmergencyContactType;
                empModel.EmergencyContactTypeDesc = data.EmergencyContactType > 0 ? this.uow.GenericRepository<ContactType>().Table().FirstOrDefault(x => x.ContactTypeId == data.EmergencyContactType).ContactTypeDesc : "";
                empModel.EmergencyContactNo = data.EmergencyContactNo;
                empModel.TelephoneNo = data.TelephoneNo;
                empModel.Fax = data.Fax;
                empModel.RelationshipToEmployee = data.RelationshipToEmployee;
                empModel.RelationshipToEmployeeDesc = data.RelationshipToEmployee > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == data.RelationshipToEmployee).RSPDescription : "";
                empModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforEmployee(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                empModel.FacilityArray = fac != "" ? this.GetFacilityArrayforEmployee(fac) : new List<int>();
                empModel.IsActive = data.IsActive;
                empModel.staffAddressDetails = this.GetStaffAddressdetails(data.EmployeeId);
                empModel.staffCampusDetails = this.GetStaffCampusDetails(data.EmployeeId);
                empModel.staffEducationDetails = this.GetStaffEducationDetails(data.EmployeeId);
                empModel.staffFamilyDetails = this.GetStaffFamilyDetails(data.EmployeeId);
                empModel.staffHobbyDetails = this.GetStaffHobbyDetails(data.EmployeeId);
                empModel.staffLanguageDetails = this.GetStaffLanguageDetails(data.EmployeeId);
                empModel.staffWorkDetails = this.GetStaffWorkHistoryDetails(data.EmployeeId);
                empModel.StaffFile = this.GetFile(data.EmployeeId.ToString(), "Staff").Count() > 0 ? this.GetFile(data.EmployeeId.ToString(), "Staff") : new List<clsViewFile>();

                if (empModel.StaffFile.Count() > 0)
                {
                    //byte[] bytes = System.IO.File.ReadAllBytes(empModel.StaffFile.FirstOrDefault().FileUrl);
                    //empModel.StaffImage = Convert.ToBase64String(bytes);
                    empModel.StaffImage = empModel.StaffFile.FirstOrDefault().ActualFile;
                }
            }

            return empModel;
        }

        ///// <summary>
        ///// Get Facility names
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public string GetFacilitiesforEmployee(string FacilityId)
        {
            string FacilitiesName = "";
            string[] facilityIds = FacilityId.Split(',');
            if (facilityIds.Length > 0)
            {
                for (int i = 0; i < facilityIds.Length; i++)
                {
                    if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                    {
                        if (i + 1 == facilityIds.Length)
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                        }
                        else
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                        }
                    }
                }
            }
            return FacilitiesName;
        }

        ///// <summary>
        ///// Get Facility names
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public List<int> GetFacilityArrayforEmployee(string FacilityId)
        {
            List<int> FacilityArray = new List<int>();
            if (FacilityId.Contains(","))
            {
                string[] facilityIds = FacilityId.Split(',');
                if (facilityIds.Length > 0)
                {
                    for (int i = 0; i < facilityIds.Length; i++)
                    {
                        if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                        {
                            if (!FacilityArray.Contains(Convert.ToInt32(facilityIds[i])))
                            {
                                FacilityArray.Add(Convert.ToInt32(facilityIds[i]));
                            }
                        }
                    }
                }
            }
            else
            {
                var facData = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(FacilityId)).FacilityId;
                FacilityArray.Add(facData);
            }
            return FacilityArray;
        }

        ///// <summary>
        ///// Get Languages
        ///// </summary>
        ///// <param>string preferredlanguage</param>
        ///// <returns>string. if languages for given preferredlanguage = success. else = failure</returns>
        public string GetLanguagesforEmployee(string preferredlanguage)
        {
            string Languages = "";
            string[] languageIds = preferredlanguage.Split(',');
            if (languageIds.Length > 0)
            {
                for (int i = 0; i < languageIds.Length; i++)
                {
                    if (languageIds[i] != null && languageIds[i] != "" && Convert.ToInt32(languageIds[i]) > 0)
                    {
                        if (i + 1 == languageIds.Length)
                        {
                            if (Languages == null || Languages == "")
                            {
                                Languages = this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(languageIds[i])).LanguageDescription;
                            }
                            else
                            {
                                Languages = Languages + this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(languageIds[i])).LanguageDescription;
                            }
                        }
                        else
                        {
                            if (Languages == null || Languages == "")
                            {
                                Languages = this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(languageIds[i])).LanguageDescription + ", ";
                            }
                            else
                            {
                                Languages = Languages + this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(languageIds[i])).LanguageDescription + ", ";
                            }
                        }
                    }
                }
            }
            return Languages;
        }

        ///// <summary>
        ///// Get Language
        ///// </summary>
        ///// <param>string preferredlanguage</param>
        ///// <returns>List<int>. if language names for given preferredlanguage = success. else = failure</returns>
        public List<int> GetLanguageArrayforEmployee(string preferredlanguage)
        {
            List<int> LanguageArray = new List<int>();
            if (preferredlanguage.Contains(","))
            {
                string[] languageIds = preferredlanguage.Split(',');
                if (languageIds.Length > 0)
                {
                    for (int i = 0; i < languageIds.Length; i++)
                    {
                        if (languageIds[i] != null && languageIds[i] != "" && Convert.ToInt32(languageIds[i]) > 0)
                        {
                            if (!LanguageArray.Contains(Convert.ToInt32(languageIds[i])))
                            {
                                LanguageArray.Add(Convert.ToInt32(languageIds[i]));
                            }
                        }
                    }
                }
            }
            else
            {
                var langData = this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(preferredlanguage)).LanguageId;
                LanguageArray.Add(langData);
            }
            return LanguageArray;
        }

        ///// <summary>
        ///// Get Language List
        ///// </summary>
        ///// <param>string preferredlanguage</param>
        ///// <returns>List<string>. if language names for given preferredlanguage = success. else = failure</returns>
        public List<string> GetLanguageListforEmployee(string preferredlanguage)
        {
            List<string> LanguageList = new List<string>();
            if (preferredlanguage.Contains(","))
            {
                string[] languageIds = preferredlanguage.Split(',');
                if (languageIds.Length > 0)
                {
                    for (int i = 0; i < languageIds.Length; i++)
                    {
                        if (languageIds[i] != null && languageIds[i] != "" && Convert.ToInt32(languageIds[i]) > 0)
                        {
                            var langData = this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(languageIds[i])).LanguageDescription;
                           
                            if (!LanguageList.Contains(langData))
                            {
                                LanguageList.Add(langData);
                            }
                        }
                    }
                }
            }
            else
            {
                var langData = this.uow.GenericRepository<Language>().Table().FirstOrDefault(x => x.LanguageId == Convert.ToInt32(preferredlanguage)).LanguageDescription;
                LanguageList.Add(langData);
            }
            return LanguageList;
        }

        ///// <summary>
        ///// Get Staff (Employee) Address details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeAddressInfoModel>. if collection of Employee Address data = success. else = failure</returns>
        public List<EmployeeAddressInfoModel> GetStaffAddressdetails(int employeeId)
        {
            var staffAddressCollection = (from address in this.uow.GenericRepository<EmployeeAddressInfo>().Table().Where(x => x.EmployeeID == employeeId)
                                          select new
                                          {
                                              address.EmployeeAddressId,
                                              address.EmployeeID,
                                              address.AddressType,
                                              address.Address1,
                                              address.Address2,
                                              address.City,
                                              address.District,
                                              address.Pincode,
                                              address.State,
                                              address.Country,
                                              address.ValidFrom,
                                              address.ValidTo,

                                          }).AsEnumerable().Select(EAM => new EmployeeAddressInfoModel
                                          {
                                              EmployeeID = EAM.EmployeeID,
                                              AddressType = EAM.AddressType,
                                              AddressTypeDesc = EAM.AddressType > 0 ? this.uow.GenericRepository<AddressType>().Table().FirstOrDefault(x => x.AddressTypeId == EAM.AddressType).AddressTypeDescription : "",
                                              Address1 = EAM.Address1,
                                              Address2 = EAM.Address2,
                                              City = EAM.City,
                                              District = EAM.District,
                                              Pincode = EAM.Pincode,
                                              State = EAM.State,
                                              Country = EAM.Country,
                                              ValidFrom = EAM.ValidFrom,
                                              ValidTo = EAM.ValidTo

                                          }).ToList();

            return staffAddressCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) campus details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeCampusModel>. if collection of Employee campus data = success. else = failure</returns>
        public List<EmployeeCampusModel> GetStaffCampusDetails(int employeeId)
        {
            var staffCampusCollection = (from campus in this.uow.GenericRepository<EmployeeCampus>().Table().Where(x => x.EmployeeID == employeeId)
                                         select new
                                         {
                                             campus.EmployeeCampusId,
                                             campus.EmployeeID,
                                             campus.Name,
                                             campus.CampusDate,
                                             campus.Details

                                         }).AsEnumerable().Select(ECM => new EmployeeCampusModel
                                         {
                                             EmployeeCampusId = ECM.EmployeeCampusId,
                                             EmployeeID = ECM.EmployeeID,
                                             Name = ECM.Name,
                                             CampusDate = ECM.CampusDate,
                                             Details = ECM.Details

                                         }).ToList();
            return staffCampusCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) Education details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeEducationInfoModel>. if collection of Employee education data = success. else = failure</returns>
        public List<EmployeeEducationInfoModel> GetStaffEducationDetails(int employeeId)
        {
            var staffEducationCollection = (from education in this.uow.GenericRepository<EmployeeEducationInfo>().Table().Where(x => x.EmployeeID == employeeId)
                                            select new
                                            {
                                                education.EmployeeEducationID,
                                                education.EmployeeID,
                                                education.University,
                                                education.Month,
                                                education.Year,
                                                education.InstituteName,
                                                education.Percentage,
                                                education.Branch,
                                                education.MainSubject,
                                                education.Scholorship,
                                                education.Qualification,
                                                education.Duration,
                                                education.PlaceOfInstitute,
                                                education.RegistrationAuthority,
                                                education.RegistrationNo,
                                                education.RegistrationExpiryDate,
                                                education.AdditionalInfo

                                            }).AsEnumerable().Select(EEM => new EmployeeEducationInfoModel
                                            {
                                                EmployeeEducationID = EEM.EmployeeEducationID,
                                                EmployeeID = EEM.EmployeeID,
                                                University = EEM.University,
                                                Month = EEM.Month,
                                                Year = EEM.Year,
                                                InstituteName = EEM.InstituteName,
                                                Percentage = EEM.Percentage,
                                                Branch = EEM.Branch,
                                                MainSubject = EEM.MainSubject,
                                                Scholorship = EEM.Scholorship,
                                                Qualification = EEM.Qualification,
                                                Duration = EEM.Duration,
                                                PlaceOfInstitute = EEM.PlaceOfInstitute,
                                                RegistrationAuthority = EEM.RegistrationAuthority,
                                                RegistrationNo = EEM.RegistrationNo,
                                                RegistrationExpiryDate = EEM.RegistrationExpiryDate,
                                                AdditionalInfo = EEM.AdditionalInfo

                                            }).ToList();

            return staffEducationCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) Family details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeFamilyInfoModel>. if collection of Employee family data = success. else = failure</returns>
        public List<EmployeeFamilyInfoModel> GetStaffFamilyDetails(int employeeId)
        {
            var staffFamilyInfoCollection = (from family in this.uow.GenericRepository<EmployeeFamilyInfo>().Table().Where(x => x.EmployeeID == employeeId)
                                             select new
                                             {
                                                 family.EmployeeFamilyID,
                                                 family.EmployeeID,
                                                 family.Salutation,
                                                 family.FirstName,
                                                 family.MiddleName,
                                                 family.LastName,
                                                 family.Gender,
                                                 family.Age,
                                                 family.CellNo,
                                                 family.PhoneNo,
                                                 family.WhatsAppNo,
                                                 family.EMail,
                                                 family.RelationshipToEmployee,
                                                 family.Occupation,
                                                 family.AdditionalInfo

                                             }).AsEnumerable().Select(EFM => new EmployeeFamilyInfoModel
                                             {
                                                 EmployeeFamilyID = EFM.EmployeeFamilyID,
                                                 EmployeeID = EFM.EmployeeID,
                                                 Salutation = EFM.Salutation,
                                                 SalutationDesc = EFM.Salutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == EFM.Salutation).SalutationDesc : "",
                                                 FirstName = EFM.FirstName,
                                                 MiddleName = EFM.MiddleName,
                                                 LastName = EFM.LastName,
                                                 Gender = EFM.Gender,
                                                 GenderDesc = EFM.Gender > 0 ? this.uow.GenericRepository<Gender>().Table().FirstOrDefault(x => x.GenderID == EFM.Gender).GenderDesc : "",
                                                 Age = EFM.Age,
                                                 CellNo = EFM.CellNo,
                                                 PhoneNo = EFM.PhoneNo,
                                                 WhatsAppNo = EFM.WhatsAppNo,
                                                 EMail = EFM.EMail,
                                                 RelationshipToEmployee = EFM.RelationshipToEmployee,
                                                 RelationshipToEmployeeDesc = EFM.RelationshipToEmployee > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == EFM.RelationshipToEmployee).RSPDescription : "",
                                                 Occupation = EFM.Occupation,
                                                 AdditionalInfo = EFM.AdditionalInfo

                                             }).ToList();

            return staffFamilyInfoCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) Hobby details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeHobbyInfoModel>. if collection of Employee Hobby data = success. else = failure</returns>
        public List<EmployeeHobbyInfoModel> GetStaffHobbyDetails(int employeeId)
        {
            var staffHobbyInfoCollection = (from hobby in this.uow.GenericRepository<EmployeeHobbyInfo>().Table().Where(x => x.EmployeeID == employeeId)
                                            select new
                                            {
                                                hobby.EmployeeHobbyId,
                                                hobby.EmployeeID,
                                                hobby.ActivityType,
                                                hobby.Details

                                            }).AsEnumerable().Select(EHM => new EmployeeHobbyInfoModel
                                            {
                                                EmployeeHobbyId = EHM.EmployeeHobbyId,
                                                EmployeeID = EHM.EmployeeID,
                                                ActivityType = EHM.ActivityType,
                                                ActivityTypeDescription = EHM.ActivityType > 0 ? this.uow.GenericRepository<EmpExtracurricularActivitiesType>().Table().FirstOrDefault(x => x.ActivityTypeId == EHM.ActivityType).ActivityTypeDescription : "",
                                                Details = EHM.Details

                                            }).ToList();

            return staffHobbyInfoCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) Language details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeLanguageInfoModel>. if collection of Employee Language data = success. else = failure</returns>
        public List<EmployeeLanguageInfoModel> GetStaffLanguageDetails(int employeeId)
        {
            var staffLanguageInfoCollection = (from language in this.uow.GenericRepository<EmployeeLanguageInfo>().Table().Where(x => x.EmployeeID == employeeId)
                                               select new
                                               {
                                                   language.EmployeeLanguageID,
                                                   language.EmployeeID,
                                                   language.Language,
                                                   language.IsSpeak,
                                                   language.SpeakingLevel,
                                                   language.IsRead,
                                                   language.ReadingLevel,
                                                   language.IsWrite,
                                                   language.WritingLevel

                                               }).AsEnumerable().Select(ELM => new EmployeeLanguageInfoModel
                                               {
                                                   EmployeeLanguageID = ELM.EmployeeLanguageID,
                                                   EmployeeID = ELM.EmployeeID,
                                                   Language = ELM.Language,
                                                   IsSpeak = ELM.IsSpeak,
                                                   SpeakingLevel = ELM.SpeakingLevel,
                                                   IsRead = ELM.IsRead,
                                                   ReadingLevel = ELM.ReadingLevel,
                                                   IsWrite = ELM.IsWrite,
                                                   WritingLevel = ELM.WritingLevel

                                               }).ToList();

            return staffLanguageInfoCollection;
        }

        ///// <summary>
        ///// Get Staff (Employee) Work details
        ///// </summary>
        ///// <param>int employeeId</param>
        ///// <returns>List<EmployeeWorkHistoryModel>. if collection of Employee Work History data = success. else = failure</returns>
        public List<EmployeeWorkHistoryModel> GetStaffWorkHistoryDetails(int employeeId)
        {
            var staffWorkHistoryCollection = (from work in this.uow.GenericRepository<EmployeeWorkHistory>().Table().Where(x => x.EmployeeID == employeeId)
                                              select new
                                              {
                                                  work.EmployeeWorkHistoryId,
                                                  work.EmployeeID,
                                                  work.EmployerName,
                                                  work.ContactPerson,
                                                  work.EMail,
                                                  work.CellNo,
                                                  work.PhoneNo,
                                                  work.Address1,
                                                  work.Address2,
                                                  work.Town,
                                                  work.City,
                                                  work.District,
                                                  work.State,
                                                  work.Country,
                                                  work.Pincode,
                                                  work.FromDate,
                                                  work.ToDate,
                                                  work.AdditionalInfo

                                              }).AsEnumerable().Select(EWM => new EmployeeWorkHistoryModel
                                              {
                                                  EmployeeWorkHistoryId = EWM.EmployeeWorkHistoryId,
                                                  EmployeeID = EWM.EmployeeID,
                                                  EmployerName = EWM.EmployerName,
                                                  ContactPerson = EWM.ContactPerson,
                                                  EMail = EWM.EMail,
                                                  CellNo = EWM.CellNo,
                                                  PhoneNo = EWM.PhoneNo,
                                                  Address1 = EWM.Address1,
                                                  Address2 = EWM.Address2,
                                                  Town = EWM.Town,
                                                  City = EWM.City,
                                                  District = EWM.District,
                                                  State = EWM.State,
                                                  Country = EWM.Country,
                                                  Pincode = EWM.Pincode,
                                                  FromDate = EWM.FromDate,
                                                  ToDate = EWM.ToDate,
                                                  AdditionalInfo = EWM.AdditionalInfo

                                              }).ToList();

            return staffWorkHistoryCollection;
        }

        ///// <summary>
        ///// Get providers by facilityID
        ///// </summary>
        ///// <param>int facilityID</param>
        ///// <returns>List<Provider>. if Collection of provider for given FacilityID = success. else = failure</returns>
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            List<Provider> providers = new List<Provider>();

            if (facilityID == 0)
            {
                providers = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();
            }
            else
            {
                var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false & (x.FacilityId != null & x.FacilityId != "")).ToList();

                if (provData.Count() > 0)
                {
                    foreach (var data in provData)
                    {
                        if (data.FacilityId.Contains(","))
                        {
                            if (data.FacilityId.Split(',').Length > 0)
                            {
                                string[] facilityIds = data.FacilityId.Split(',');
                                if (facilityIds.Length > 0)
                                {
                                    for (int i = 0; i < facilityIds.Length; i++)
                                    {
                                        if (facilityIds[i] != null && facilityIds[i] != "" && (Convert.ToInt32(facilityIds[i]) == facilityID))
                                        {
                                            if (!providers.Contains(data))
                                            {
                                                providers.Add(data);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(data.FacilityId) == facilityID)
                            {
                                if (!providers.Contains(data))
                                {
                                    providers.Add(data);
                                }
                            }
                        }
                    }
                }
            }

            return providers;
        }

        ///// <summary>
        ///// Get providers by facilityID
        ///// </summary>
        ///// <param>int facilityID</param>
        ///// <returns>List<Employee>. if Collection of Employee for given FacilityID = success. else = failure</returns>
        public List<Employee> GetStaffsbyFacility(int facilityID)
        {
            List<Employee> staffs = new List<Employee>();

            if (facilityID == 0)
            {
                staffs = this.uow.GenericRepository<Employee>().Table().Where(x => x.IsActive != false).ToList();
            }
            else
            {
                var empData = this.uow.GenericRepository<Employee>().Table().Where(x => x.IsActive != false & (x.FacilityId != null & x.FacilityId != "")).ToList();

                if (staffs.Count() > 0)
                {
                    foreach (var data in staffs)
                    {
                        if (data.FacilityId.Contains(","))
                        {
                            if (data.FacilityId.Split(',').Length > 0)
                            {
                                string[] facilityIds = data.FacilityId.Split(',');
                                if (facilityIds.Length > 0)
                                {
                                    for (int i = 0; i < facilityIds.Length; i++)
                                    {
                                        if (facilityIds[i] != null && facilityIds[i] != "" && (Convert.ToInt32(facilityIds[i]) == facilityID))
                                        {
                                            if (!staffs.Contains(data))
                                            {
                                                staffs.Add(data);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(data.FacilityId) == facilityID)
                            {
                                if (!staffs.Contains(data))
                                {
                                    staffs.Add(data);
                                }
                            }
                        }
                    }
                }
            }

            return staffs;
        }

        #endregion

        #region File Access

        ///// <summary>
        ///// Get File
        ///// </summary>
        ///// <param>(string Id, string screen)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<clsViewFile> GetFile(string Id, string screen)
        {
            string moduleName = "";
            if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
            {
                hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            //if (hostingEnvironment.WebRootPath != null)
            moduleName = hostingEnvironment.WebRootPath + "\\Documents\\" + screen + "\\" + Id;

            var fileLoc = this.iTenantMasterService.GetFiles(moduleName);

            return fileLoc;
        }

        ///// <summary>
        ///// Delete
        ///// </summary>
        ///// <param>(string path, string fileName)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<string> DeleteFile(string path, string fileName)
        {
            var fileStatus = this.iTenantMasterService.DeleteFile(path, fileName);

            return fileStatus;
        }

        #endregion

    }
}
