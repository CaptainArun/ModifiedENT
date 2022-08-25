using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AuthController : Controller
    {
        public readonly IAppAuthService iAppAuthService;
        public readonly ITenantMasterService iTenantMasterService;

        public AuthController(IAppAuthService _iAppAuthService, ITenantMasterService _iTenantMasterService)
        {
            iAppAuthService = _iAppAuthService;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        [HttpGet]
        [AllowAnonymous]
        public List<Gender> GetGenderList()
        {
            return this.iTenantMasterService.GetAllGender();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<AddressType> GetAddressTypeList()
        {
            return this.iTenantMasterService.GetAllAddressTypes();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Language> GetLanguageList()
        {
            return this.iTenantMasterService.GetAllLanguages();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Salutation> GetSalutationList()
        {
            return this.iTenantMasterService.GetAllSalutations();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<IdentificationIdType> GetIdentificationTypeList()
        {
            return this.iTenantMasterService.GetAllIdentificationTypes();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<MaritalStatus> GetAllMaritalStatuses()
        {
            return this.iTenantMasterService.GetMaritalStatuses();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<BloodGroup> GetBloodGroupList()
        {
            return this.iTenantMasterService.GetAllBloodGroups();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<ContactType> GetContactTypeList()
        {
            return this.iTenantMasterService.GetContactTypes();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Relationshiptopatient> GetAllRelations()
        {
            return this.iTenantMasterService.GetRelationstoPatient();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Roles> GetRoles()
        {
            return this.iTenantMasterService.GetRolesList();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<FacilityModel> GetFacilities()
        {
            return this.iTenantMasterService.GetAllFacilities();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<UserType> GetUserType()
        {
            return this.iTenantMasterService.GetUserType();
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Departments> GetDepartmentsForSearch(string searchKey)
        {
            var depList = this.iTenantMasterService.GetDepartmentList().Where(x => x.DepartCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) | x.DepartmentDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            return depList;
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Language> GetLanguagesForSearch(string searchKey)
        {
            var languageList = this.iTenantMasterService.GetAllLanguages().Where(x => x.LanguageCode.ToLower().Trim().Contains(searchKey.ToLower().Trim()) | x.LanguageDescription.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            return languageList;
        }

        [HttpGet]
        [AllowAnonymous]
        public List<string> GetEmployeeNumber()
        {
            List<string> empNo = new List<string>();
            var empNumber = this.iTenantMasterService.GetEmployeeNo();
            empNo.Add(empNumber);

            return empNo;
        }

        #endregion

        [HttpPost]
        [AllowAnonymous]
        public async Task<BaseModel> UserAuthendicate(LoginModel loginModel)
        {
            if (ModelState.IsValid)
            {
                return await iAppAuthService.Authendicate(loginModel);
            }

            else
            {
                return new BaseModel();
            }

        }

        //[Authorize]
        [HttpGet]
        public async Task<List<UserModel>> GetUserModels()
        {
            return await this.iAppAuthService.GetUserModels();
        }

        [HttpGet]
        public async Task<List<Facility>> GetFacilitiesbyUser()
        {
            return await this.iAppAuthService.GetFacilitiesbyUser();
        }

        [HttpGet]
        public List<EmployeeNewModel> GetEmployees()
        {
            return this.iAppAuthService.GetEmployees();
        }

        [HttpGet]
        public List<EmployeeModel> GetEmployeeDetails()
        {
            return this.iAppAuthService.GetEmployeeDetails();
        }

        [HttpGet]
        public async Task<List<EmployeeModel>> GetEmployeeDetailsbyUser()
        {
            return await this.iAppAuthService.GetEmployeeDetailsbyUser();
        }

        [HttpGet]
        public async Task<List<string>> GetImageforCurrentUser()
        {
            return await this.iAppAuthService.GetImageforCurrentUser();
        }

        [HttpGet]
        public List<MenuModel> GetScreenForCurrentUser(string UserId)
        {
            return this.iAppAuthService.GetScreenForCurrentUser(UserId);
        }

        #region User Registeration

        [HttpPost]
        [AllowAnonymous]
        public EmployeeNewModel RegisterStaff(EmployeeNewModel employeeModel)
        {
            return this.iAppAuthService.RegisterStaff(employeeModel);
        }

        [HttpPost]
        [AllowAnonymous]
        public ProviderModel RegisterProvider(ProviderModel provData)
        {
            return this.iAppAuthService.RegisterProvider(provData);
        }

        #endregion
    }
}
