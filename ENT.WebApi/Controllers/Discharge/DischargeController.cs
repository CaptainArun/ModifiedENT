using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class DischargeController : Controller
    {
        public readonly IDischargeService iDischargeService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public DischargeController(IDischargeService _iDischargeService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iDischargeService = _iDischargeService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        [HttpGet]
        public List<DrugCode> GetDrugCodesforDischarge(string searchKey)
        {
            return this.iDischargeService.GetDrugCodesforDischarge(searchKey);
        }

        [HttpGet]
        public List<DiagnosisCode> GetDiagnosisCodesforDischarge(string searchKey)
        {
            return this.iDischargeService.GetDiagnosisCodesforDischarge(searchKey);
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRoutesforDischarge()
        {
            return this.iDischargeService.GetMedicationRoutesforDischarge();
        }

        [HttpGet]
        public List<UrgencyType> GetUrgencyTypesforDischarge()
        {
            return this.iDischargeService.GetUrgencyTypesforDischarge();
        }

        #endregion

        #region Search and Count

        [HttpGet]
        public DischargeCountModel GetDischargeCounts()
        {
            return this.iDischargeService.GetDischargeCounts();
        }

        [HttpGet]
        public List<Patient> GetPatientsForDischarge(string searchKey)
        {
            return this.iDischargeService.GetPatientsForDischarge(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforDischarge(string searchKey)
        {
            return this.iDischargeService.GetProvidersforDischarge(searchKey);
        }

        [HttpGet]
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            return this.iDischargeService.GetAdmissionNumbersbySearch(searchKey);
        }

        [HttpPost]
        public List<DischargeSummaryModel> GetDischargeRecordsbySearch(SearchModel searchModel)
        {
            return this.iDischargeService.GetDischargeRecordsbySearch(searchModel);
        }

        #endregion

        #region Discharge Summary 

        [HttpGet]
        public List<DischargeSummaryModel> GetDischargeRecords()
        {
            return this.iDischargeService.GetDischargeRecords();
        }

        [HttpGet]
        public DischargeSummaryModel GetDischargeSummaryRecordbyID(int dischargeSummaryId)
        {
            return this.iDischargeService.GetDischargeSummaryRecordbyID(dischargeSummaryId);
        }

        [HttpGet]
        public DischargeSummaryModel GetDischargeRecordbyAdmissionID(int admissionID)
        {
            return this.iDischargeService.GetDischargeRecordbyAdmissionID(admissionID);
        }

        [HttpPost]
        public DischargeSummaryModel AddUpdateDischargeSummaryRecord(DischargeSummaryModel dischargeSummaryModel)
        {
            return this.iDischargeService.AddUpdateDischargeSummaryRecord(dischargeSummaryModel);
        }

        #endregion

        #region Patient Data

        [HttpGet]
        public PatientDemographicModel GetPatientDetailByPatientId(int PatientId)
        {
            return this.iDischargeService.GetPatientDetailByPatientId(PatientId);
        }

        #endregion

        #region Medication Request => (E - Prescription)

        [HttpPost]
        public MedicationRequestsModel AddUpdateMedicationRequestforDischarge(MedicationRequestsModel medicationRequestsModel)
        {
            return this.iDischargeService.AddUpdateMedicationRequestforDischarge(medicationRequestsModel);
        }

        [HttpGet]
        public MedicationRequestsModel GetMedicationRequestForAdmission(int admissionId)
        {
            return this.iDischargeService.GetMedicationRequestForAdmission(admissionId);
        }

        [HttpGet]
        public MedicationRequests CancelMedicationRequestFromDischarge(int medicationRequestId)
        {
            return this.iDischargeService.CancelMedicationRequestFromDischarge(medicationRequestId);
        }

        #endregion

        #region e Lab Request - Discharge

        [HttpGet]
        public List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromDischarge(string searchKey)
        {
            return this.iDischargeService.GetELabSetupMastersbySearchfromDischarge(searchKey);
        }

        [HttpPost]
        public eLabRequestModel AddUpdateELabRequestfromDischarge(eLabRequestModel elabRequest)
        {
            return this.iDischargeService.AddUpdateELabRequestfromDischarge(elabRequest);
        }

        [HttpGet]
        public eLabRequestModel GetELabRequestforAdmission(int admissionId)
        {
            return this.iDischargeService.GetELabRequestforAdmission(admissionId);
        }

        [HttpGet]
        public eLabRequestModel GetELabRequestbyIdfromDischarge(int labRequestId)
        {
            return this.iDischargeService.GetELabRequestbyIdfromDischarge(labRequestId);
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
            return this.iDischargeService.GetFile(Id.ToString(), screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iDischargeService.DeleteFile(path, fileName);
        }
        #endregion

        #region SignOff

        [HttpPost]
        public Task<SigningOffModel> SignoffUpdationforDischarge(SigningOffModel signOffModel)
        {
            return this.iDischargeService.SignoffUpdationforDischarge(signOffModel);
        }

        #endregion

    }
}
