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
    public class PostProcedureController : Controller
    {
        public readonly IPostProcedureService iPostProcedureService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public PostProcedureController(IPostProcedureService _iPostProcedureService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iPostProcedureService = _iPostProcedureService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data 

        [HttpGet]
        public List<DrugCode> GetDrugCodesforPostProcedureCasesheet(string searchKey)
        {
            return this.iPostProcedureService.GetDrugCodesforPostProcedureCasesheet(searchKey);
        }

        [HttpGet]
        public List<RecordedDuring> GetRecordedDuringOptionsforPostProcedure()
        {
            return this.iPostProcedureService.GetRecordedDuringOptionsforPostProcedure();
        }

        [HttpGet]
        public List<TreatmentCode> GetProcedureCodes(string searchKey)
        {
            return this.iPostProcedureService.GetProcedureCodes(searchKey);
        }

        [HttpGet]
        public List<Procedures> GetProceduresforPostProcedure(string searchKey)
        {
            return this.iPostProcedureService.GetProceduresforPostProcedure(searchKey);
        }

        [HttpGet]
        public List<TenantSpeciality> GetTenantSpecialitiesforPostProcedure()
        {
            return this.iPostProcedureService.GetTenantSpecialitiesforPostProcedure();
        }

        [HttpGet]
        public List<PatientArrivalCondition> GetPatientArrivalConditionsforPostProcedure()
        {
            return this.iPostProcedureService.GetPatientArrivalConditionsforPostProcedure();
        }

        [HttpGet]
        public List<PainScale> GetPainLevelsforPostProcedure()
        {
            return this.iPostProcedureService.GetPainLevelsforPostProcedure();
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforPostProcedure(string searchKey)
        {
            return this.iPostProcedureService.GetProvidersforPostProcedure(searchKey);
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRoutesforPostProcedure()
        {
            return this.iPostProcedureService.GetMedicationRoutesforPostProcedure();
        }

        [HttpGet]
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            return this.iPostProcedureService.GetAdmissionNumbersbySearch(searchKey);
        }

        #endregion

        #region DRug Chart - Post Procedure

        [HttpPost]
        public DrugChartModel AddUpdateDrugChartDatafromPostProcedure(DrugChartModel drugChartModel)
        {
            return this.iPostProcedureService.AddUpdateDrugChartDatafromPostProcedure(drugChartModel);
        }

        [HttpPost]
        public IEnumerable<DrugChartModel> UpdateAdministrationDrugChartfromPostProcedure(IEnumerable<DrugChartModel> drugChartCollection)
        {
            return this.iPostProcedureService.UpdateAdministrationDrugChartfromPostProcedure(drugChartCollection);
        }

        [HttpGet]
        public List<DrugChartModel> GetDrugChartListforPostProcedure()
        {
            return this.iPostProcedureService.GetDrugChartListforPostProcedure();
        }

        [HttpGet]
        public List<DrugChartModel> GetDrugChartListforPostProcedurebyAdmissionNumber(string admissionNo)
        {
            return this.iPostProcedureService.GetDrugChartListforPostProcedurebyAdmissionNumber(admissionNo);
        }

        [HttpGet]
        public DrugChartModel GetDrugChartRecordfromPostProcedurebyId(int drugChartId)
        {
            return this.iPostProcedureService.GetDrugChartRecordfromPostProcedurebyId(drugChartId);
        }

        [HttpGet]
        public DrugChart DeleteDrugChartRecordfromPostProcedurebyId(int drugChartId)
        {
            return this.iPostProcedureService.DeleteDrugChartRecordfromPostProcedurebyId(drugChartId);
        }

        #endregion

        #region Post Procedure Case Sheet

        [HttpPost]
        public PostProcedureCaseSheetModel AddUpdatePostProcedureCaseSheetData(PostProcedureCaseSheetModel postProcedureCaseSheetModel)
        {
            return this.iPostProcedureService.AddUpdatePostProcedureCaseSheetData(postProcedureCaseSheetModel);
        }

        [HttpGet]
        public List<PostProcedureCaseSheetModel> GetPostProcedureCaseSheetsforPatient(int patientID)
        {
            return this.iPostProcedureService.GetPostProcedureCaseSheetsforPatient(patientID);
        }

        [HttpGet]
        public List<PostProcedureCaseSheetModel> GetAllPostProcedureCaseSheetData()
        {
            return this.iPostProcedureService.GetAllPostProcedureCaseSheetData();
        }

        [HttpGet]
        public PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyAdmissionId(int admissionId)
        {
            return this.iPostProcedureService.GetPostProcedureCaseSheetbyAdmissionId(admissionId);
        }

        [HttpGet]
        public PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyId(int postProcedureId)
        {
            return this.iPostProcedureService.GetPostProcedureCaseSheetbyId(postProcedureId);
        }

        #endregion

        #region Post Procedure Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForPostProcedureSearch(string searchKey)
        {
            return this.iPostProcedureService.GetPatientsForPostProcedureSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforPostProcedureSearch(string searchKey)
        {
            return this.iPostProcedureService.GetProvidersforPostProcedureSearch(searchKey);
        }

        [HttpGet]
        public PrePostProcedureCountModel GetTodayPostProcedureCount()
        {
            return this.iPostProcedureService.GetTodayPostProcedureCount();
        }

        [HttpPost]
        public List<PreProcedureModel> GetPreProceduresBySearch(SearchModel searchModel)
        {
            return this.iPostProcedureService.GetPreProceduresBySearch(searchModel);
        }

        #endregion

        [HttpGet]
        public List<PreProcedureModel> GetPreProceduresforPostProcedure()
        {
            return this.iPostProcedureService.GetPreProceduresforPostProcedure();
        }

        [HttpGet]
        public AdmissionsModel GetAdmissionRecordbyId(int admissionId)
        {
            return this.iPostProcedureService.GetAdmissionRecordbyId(admissionId);
        }

        [HttpPost]
        public Task<SigningOffModel> SignoffUpdationforPostProcedureCare(SigningOffModel procedureCareSignOffModel)
        {
            return this.iPostProcedureService.SignoffUpdationforPostProcedureCare(procedureCareSignOffModel);
        }

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
            return this.iPostProcedureService.GetFile(Id.ToString(), screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iPostProcedureService.DeleteFile(path, fileName);
        }
        #endregion

    }
}
