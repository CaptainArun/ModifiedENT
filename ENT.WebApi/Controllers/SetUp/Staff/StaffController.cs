using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class StaffController : Controller
    {
        public readonly IStaffService istaffService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public StaffController(IStaffService _istaffService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            istaffService = _istaffService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data 

        [HttpGet]
        public List<Gender> GetGenderList()
        {
            return this.istaffService.GetGenderList();
        }

        [HttpGet]
        public List<AddressType> GetAddressTypeList()
        {
            return this.istaffService.GetAddressTypeList();
        }

        [HttpGet]
        public List<Language> GetLanguageList()
        {
            return this.istaffService.GetLanguageList();
        }

        [HttpGet]
        public List<Salutation> GetSalutationList()
        {
            return this.istaffService.GetSalutationList();
        }

        [HttpGet]
        public List<Departments> GetAllDepartments()
        {
            return this.istaffService.GetAllDepartments();
        }

        [HttpGet]
        public List<IdentificationIdType> GetIdentificationTypeList()
        {
            return this.istaffService.GetIdentificationTypeList();
        }

        [HttpGet]
        public List<MaritalStatus> GetAllMaritalStatuses()
        {
            return this.istaffService.GetAllMaritalStatuses();
        }

        [HttpGet]
        public List<BloodGroup> GetBloodGroupList()
        {
            return this.istaffService.GetBloodGroupList();
        }

        [HttpGet]
        public List<ContactType> GetContactTypeList()
        {
            return this.istaffService.GetContactTypeList();
        }

        [HttpGet]
        public List<Relationshiptopatient> GetAllRelations()
        {
            return this.istaffService.GetAllRelations();
        }

        [HttpGet]
        public List<State> GetStateList()
        {
            return this.istaffService.GetStateList();
        }

        [HttpGet]
        public List<Country> GetCountryList()
        {
            return this.istaffService.GetCountryList();
        }

        [HttpGet]
        public List<Roles> GetRoles()
        {
            return this.istaffService.GetRoles();
        }

        [HttpGet]
        public List<Facility> GetFacilitiesbyEmployeeId(int employeeId)
        {
            return this.istaffService.GetFacilitiesbyEmployeeId(employeeId);
        }

        [HttpGet]
        public List<UserType> GetUserType()
        {
            return this.istaffService.GetUserType();
        }


        [HttpGet]
        public List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType()
        {
            return this.istaffService.GetEmpExtracurricularActivitiesType();
        }

        [HttpGet]

        public List<Patient> GetPatientsForSearch(string searchKey)
        {
            return this.istaffService.GetPatientsForSearch(searchKey);
        }

        [HttpGet]
        public List<Departments> GetDepartmentsForSearch(string searchKey)
        {
            return this.istaffService.GetDepartmentsForSearch(searchKey);
        }

        [HttpGet]
        public List<Language> GetLanguagesForSearch(string searchKey)
        {
            return this.istaffService.GetLanguagesForSearch(searchKey);
        }

        [HttpGet]
        public List<string> GetEmployeeNumber()
        {
            return this.istaffService.GetEmployeeNumber();
        }

        #endregion

        #region Staff (Employee)

        [HttpPost]
        public EmployeeNewModel AddUpdateStaffRecord(EmployeeNewModel employeeModel)
        {
            return this.istaffService.AddUpdateStaffRecord(employeeModel);
        }

        [HttpGet]
        public List<EmployeeNewModel> GetStaffs()
        {
            return this.istaffService.GetStaffs();
        }

        [HttpGet]
        public EmployeeNewModel GetStaffbyId(int employeeId)
        {
            return this.istaffService.GetStaffbyId(employeeId);
        }

        [HttpGet]
        public EmployeeNewModel GetStaffbyUserId(string UserId)
        {
            return this.istaffService.GetStaffbyUserId(UserId);
        }

        [HttpGet]
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            return this.istaffService.GetProvidersbyFacility(facilityID);
        }

        [HttpGet]
        public List<Employee> GetStaffsbyFacility(int facilityID)
        {
            return this.istaffService.GetStaffsbyFacility(facilityID);
        }

        #endregion

        #region File Access

        [HttpPost]
        public List<string> UploadFiles(string Id, string screen, List<IFormFile> file)
        {
            //string projectRootPath = hostingEnvironment.ContentRootPath;
            string appRootPath = hostingEnvironment.WebRootPath;

            List<string> status = new List<string>();
            try
            {
                if (file.Count() > 0)
                {
                    if (string.IsNullOrWhiteSpace(appRootPath))
                    {
                        appRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    }

                    string fullPath = "";
                    fullPath = appRootPath + "\\Documents\\" + screen + "\\" + Id;

                    if (screen.ToLower().Trim() == "staff")
                    {
                        var files = this.GetFile(Id, screen);
                        if (files.Count() > 0)
                        {
                            foreach (var set in files)
                            {
                                var splitPath = set.FileUrl.Split("/" + set.FileName)[0];
                                var message = this.iTenantMasterService.DeleteFile(splitPath, set.FileName);
                            }
                        }
                    }

                    this.iTenantMasterService.WriteMultipleFiles(file, fullPath);
                    status.Add("Files successfully uploaded");
                }
                else
                {
                    status.Add("No file found");
                }
            }
            catch (Exception ex)
            {
                status.Add("Error Uploading file -" + ex.Message);
            }

            return status;
        }

        [HttpGet]
        public List<clsViewFile> GetFile(string Id, string screen)
        {
            return this.istaffService.GetFile(Id, screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.istaffService.DeleteFile(path, fileName);
        }

        #endregion

    }
}
