using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class ProviderSetUpController : Controller
    {
        public readonly IProviderSetUpService iProviderSetupService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public ProviderSetUpController(IProviderSetUpService _iProviderSetupService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iProviderSetupService = _iProviderSetupService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master for Provider

        [HttpGet]
        public List<Speciality> GetAllSpecialities()
        {
            return this.iProviderSetupService.GetAllSpecialities();
        }

        [HttpGet]
        public List<Roles> GetAllRoles()
        {
            return this.iProviderSetupService.GetAllRoles();
        }

        [HttpGet]
        public List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey, int ProviderID)
        {
            return this.iProviderSetupService.GetAllDiagnosisCodes(searchKey, ProviderID);
        }

        [HttpGet]
        public List<TreatmentCode> GetAllTreatmentCodes(string searchKey, int ProviderID)
        {
            return this.iProviderSetupService.GetAllTreatmentCodes(searchKey, ProviderID);
        }

        [HttpGet]
        public List<Facility> GetAllFacilitiesforProvider()
        {
            return this.iProviderSetupService.GetAllFacilitiesforProvider();
        }

        [HttpGet]
        public List<Facility> GetFacilitiesbyProviderId(int providerId)
        {
            return this.iProviderSetupService.GetFacilitiesbyProviderId(providerId);
        }

        [HttpGet]
        public List<Gender> GetGenderListforProvider()
        {
            return this.iProviderSetupService.GetGenderListforProvider();
        }

        [HttpGet]
        public List<AddressType> GetAddressTypeListforProvider()
        {
            return this.iProviderSetupService.GetAddressTypeListforProvider();
        }

        [HttpGet]
        public List<Country> GetCountryListforProvider()
        {
            return this.iProviderSetupService.GetCountryListforProvider();
        }

        [HttpGet]
        public List<State> GetStateListforProvider()
        {
            return this.iProviderSetupService.GetStateListforProvider();
        }

        [HttpGet]
        public List<Language> GetLanguageListforProvider()
        {
            return this.iProviderSetupService.GetLanguageListforProvider();
        }

        #endregion

        #region Provider

        [HttpGet]
        public List<ProviderModel> GetAllProviders()
        {
            return this.iProviderSetupService.GetAllProviders();
        }

        [HttpGet]
        public ProviderModel GetProviderById(int ProviderId)
        {
            return this.iProviderSetupService.GetProviderById(ProviderId);
        }

        [HttpPost]
        public ProviderModel AddUpdateProvider(ProviderModel provData)
        {
            return this.iProviderSetupService.AddUpdateProvider(provData);
        }


        [HttpGet]
        public List<ProviderDiagnosisCodeModel> GetICDCodesforProvider(string searchKey, int ProviderId)
        {
            return this.iProviderSetupService.GetICDCodesforProvider(searchKey, ProviderId);
        }

        [HttpPost]
        public IEnumerable<ProviderDiagnosisCodeModel> AddUpdateDiagnosisCodes(IEnumerable<ProviderDiagnosisCodeModel> provDiagData)
        {
            return this.iProviderSetupService.AddUpdateDiagnosisCodes(provDiagData);
        }


        [HttpGet]
        public List<ProviderTreatmentCodeModel> GetCPTCodesforProvider(string searchKey, int ProviderId)
        {
            return this.iProviderSetupService.GetCPTCodesforProvider(searchKey, ProviderId);
        }

        [HttpPost]
        public IEnumerable<ProviderTreatmentCodeModel> AddUpdateCPTCodes(IEnumerable<ProviderTreatmentCodeModel> provCPTData)
        {
            return this.iProviderSetupService.AddUpdateCPTCodes(provCPTData);
        }


        [HttpGet]
        public List<ProviderSpecialityModel> GetProviderSpecialities(int ProviderId)
        {
            return this.iProviderSetupService.GetProviderSpecialities(ProviderId);
        }

        [HttpPost]
        public ProviderSpecialityModel AddUpdateProviderSpeciality(ProviderSpecialityModel SpecialityData)
        {
            return this.iProviderSetupService.AddUpdateProviderSpeciality(SpecialityData);
        }

        [HttpGet]
        public ProviderSpecialityModel GetProviderSpecialityByID(int ProvSpecialityId)
        {
            return iProviderSetupService.GetProviderSpecialityByID(ProvSpecialityId);
        }


        [HttpPost]
        public ProviderVacationModel AddUpdateVacationDetails(ProviderVacationModel VacationData)
        {
            return this.iProviderSetupService.AddUpdateVacationDetails(VacationData);
        }

        [HttpGet]
        public List<ProviderVacationModel> GetProviderVacationDetails(int ProviderId)
        {
            return this.iProviderSetupService.GetProviderVacationDetails(ProviderId);
        }

        [HttpGet]
        public ProviderVacationModel GetVacationDetailforProvider(int ProVacationId)
        {
            return this.iProviderSetupService.GetVacationDetailforProvider(ProVacationId);
        }


        [HttpGet]
        public List<ProviderScheduleModel> GetProviderScheduleDetails(int ProviderId, int facilityID)
        {
            return this.iProviderSetupService.GetProviderScheduleDetails(ProviderId, facilityID);
        }

        [HttpPost]
        public ProviderScheduleModel AddUpdateSchedules(ProviderScheduleModel ScheduleData)
        {
            return this.iProviderSetupService.AddUpdateSchedules(ScheduleData);
        }

        [HttpGet]
        public ProviderScheduleModel GetProviderSchedules(int ProviderId, int facilityID)
        {
            return this.iProviderSetupService.GetProviderSchedules(ProviderId, facilityID);
        }


        [HttpGet]
        public List<ProviderModel> SearchProvider(int ProviderId, int SpecialityId)
        {
            return this.iProviderSetupService.SearchProvider(ProviderId, SpecialityId);
        }

        [HttpGet]
        public ProviderCountModel ProviderCount()
        {
            return this.iProviderSetupService.ProviderCount();
        }
        #endregion

        #region File Access

        [HttpPost, DisableRequestSizeLimit]
        public List<string> UploadFiles(int Id, string screen, List<IFormFile> file)
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

                    if(screen.ToLower().Trim() == "provider" || screen.ToLower().Trim() == "staff" || screen.ToLower().Trim() == "patient" || screen.ToLower().Trim() == "provider/signature")
                    {
                        var files = this.GetFile(Id, screen);
                        if(files.Count() > 0)
                        {
                            foreach(var set in files)
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
        public List<clsViewFile> GetFile(int Id, string screen)
        {
            return this.iProviderSetupService.GetFile(Id.ToString(), screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iProviderSetupService.DeleteFile(path, fileName);
        }
        #endregion

    }
}