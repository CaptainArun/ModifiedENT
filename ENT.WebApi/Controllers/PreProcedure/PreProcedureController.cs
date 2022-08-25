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

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PreProcedureController : Controller
    {
        public readonly IPreProcedureService iPreProcedureService;

        public PreProcedureController(IPreProcedureService _iPreProcedureService)
        {
            iPreProcedureService = _iPreProcedureService;
        }

        #region Master Data 

        [HttpGet]
        public List<DrugCode> GetDrugCodes(string searchKey)
        {
            return this.iPreProcedureService.GetDrugCodes(searchKey);
        }

        [HttpGet]
        public List<Provider> GetProviderListForPreProcedure()
        {
            return this.iPreProcedureService.GetProviderListForPreProcedure();
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforPreProcedure(string searchKey)
        {
            return this.iPreProcedureService.GetProvidersforPreProcedure(searchKey);
        }

        [HttpGet]
        public List<TenantSpeciality> GetTenantSpecialitiesforPreProcedure()
        {
            return this.iPreProcedureService.GetTenantSpecialitiesforPreProcedure();
        }

        [HttpGet]
        public List<string> GetProviderNamesforPreProcedure(int facilityId)
        {
            return this.iPreProcedureService.GetProviderNamesforPreProcedure(facilityId);
        }

        [HttpGet]
        public List<RecordedDuring> GetRecordedDuringOptionsforPreProcedure()
        {
            return this.iPreProcedureService.GetRecordedDuringOptionsforPreProcedure();
        }

        [HttpGet]
        public List<AdmissionsModel> GetAdmissionDataforDrugChart()
        {
            return this.iPreProcedureService.GetAdmissionDataforDrugChart();
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRoutesforPreProcedure()
        {
            return this.iPreProcedureService.GetMedicationRoutesforPreProcedure();
        }

        [HttpGet]
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            return this.iPreProcedureService.GetAdmissionNumbersbySearch(searchKey);
        }

        #endregion

        #region Anesthesia Fitness

        [HttpPost]
        public AnesthesiafitnessModel AddUpdateAnesthesiaFitness(AnesthesiafitnessModel anesthesiafitnessModel)
        {
            return this.iPreProcedureService.AddUpdateAnesthesiaFitness(anesthesiafitnessModel);
        }

        [HttpGet]
        public List<AnesthesiafitnessModel> GetAnesthesiafitnessList()
        {
            return this.iPreProcedureService.GetAnesthesiafitnessList();
        }

        [HttpGet]
        public List<AnesthesiafitnessModel> GetAnesthesiafitnessListforPatient(int patientId)
        {
            return this.iPreProcedureService.GetAnesthesiafitnessListforPatient(patientId);
        }

        [HttpGet]
        public AnesthesiafitnessModel GetAnesthesiafitnessRecordbyID(int anesthesiafitnessId)
        {
            return this.iPreProcedureService.GetAnesthesiafitnessRecordbyID(anesthesiafitnessId);
        }

        [HttpGet]
        public AnesthesiafitnessModel GetAnesthesiafitnessRecordbyAdmissionID(int admissionID)
        {
            return this.iPreProcedureService.GetAnesthesiafitnessRecordbyAdmissionID(admissionID);
        }

        [HttpGet]
        public Anesthesiafitness DeleteAnesthesiaRecordbyId(int anesthesiafitnessId)
        {
            return this.iPreProcedureService.DeleteAnesthesiaRecordbyId(anesthesiafitnessId);
        }

        #endregion

        #region Drug Chart

        [HttpPost]
        public DrugChartModel AddUpdateDrugChartData(DrugChartModel drugChartModel)
        {
            return this.iPreProcedureService.AddUpdateDrugChartData(drugChartModel);
        }

        [HttpPost]
        public IEnumerable<DrugChartModel> UpdateAdministrationDrugChart(IEnumerable<DrugChartModel> drugChartCollection)
        {
            return this.iPreProcedureService.UpdateAdministrationDrugChart(drugChartCollection);
        }

        [HttpGet]
        public List<DrugChartModel> GetDrugChartList()
        {
            return this.iPreProcedureService.GetDrugChartList();
        }

        [HttpGet]
        public List<DrugChartModel> GetDrugChartListforPreProcedure()
        {
            return this.iPreProcedureService.GetDrugChartListforPreProcedure();
        }

        [HttpGet]
        public List<DrugChartModel> GetDrugChartListforPreProcedurebyAdmissionNumber(string admissionNo)
        {
            return this.iPreProcedureService.GetDrugChartListforPreProcedurebyAdmissionNumber(admissionNo);
        }

        [HttpGet]
        public DrugChartModel GetDrugChartRecordbyId(int drugChartId)
        {
            return this.iPreProcedureService.GetDrugChartRecordbyId(drugChartId);
        }

        [HttpGet]
        public DrugChart DeleteDrugChartRecordbyId(int drugChartId)
        {
            return this.iPreProcedureService.DeleteDrugChartRecordbyId(drugChartId);
        }

        #endregion

        [HttpGet]
        public List<AdmissionsModel> GetAllAdmissionsforPreProcedure()
        {
            return this.iPreProcedureService.GetAllAdmissionsforPreProcedure();
        }

        [HttpGet]
        public AdmissionsModel GetPreProcedureAdmissionRecordbyId(int admissionId)
        {
            return this.iPreProcedureService.GetPreProcedureAdmissionRecordbyId(admissionId);
        }

        [HttpPost]
        public Task<SigningOffModel> SignoffUpdationforPreProcedureCare(SigningOffModel procedureCareSignOffModel)
        {
            return this.iPreProcedureService.SignoffUpdationforPreProcedureCare(procedureCareSignOffModel);
        }

        #region Pre Procedure

        [HttpPost]
        public PreProcedureModel AddUpdatePreProcedureData(PreProcedureModel preProcedureModel)
        {
            return this.iPreProcedureService.AddUpdatePreProcedureData(preProcedureModel);
        }

        [HttpGet]
        public List<PreProcedureModel> GetPreProceduresforPatient(int patientID)
        {
            return this.iPreProcedureService.GetPreProceduresforPatient(patientID);
        }

        [HttpGet]
        public List<PreProcedureModel> GetAllPreProcedures()
        {
            return this.iPreProcedureService.GetAllPreProcedures();
        }

        [HttpGet]
        public PreProcedureModel GetPreProcedurebyAdmissionId(int admissionId)
        {
            return this.iPreProcedureService.GetPreProcedurebyAdmissionId(admissionId);
        }

        [HttpGet]
        public PreProcedureModel GetPreProcedurebyId(int preProcedureId)
        {
            return this.iPreProcedureService.GetPreProcedurebyId(preProcedureId);
        }

        [HttpGet]
        public PreProcedure CancelPreProcedure(int admissionId, string Reason)
        {
            return this.iPreProcedureService.CancelPreProcedure(admissionId, Reason);
        }

        [HttpGet]
        public List<string> UserVerification(string UserName, string Password)
        {
            return this.iPreProcedureService.UserVerification(UserName, Password);
        }

        #endregion

        #region PreProcedure Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForPreProcedureSearch(string searchKey)
        {
            return this.iPreProcedureService.GetPatientsForPreProcedureSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforPreProcedureSearch(string searchKey)
        {
            return this.iPreProcedureService.GetProvidersforPreProcedureSearch(searchKey);
        }

        [HttpGet]
        public PrePostProcedureCountModel GetTodayPreProcedureCount()
        {
            return this.iPreProcedureService.GetTodayPreProcedureCount();
        }

        [HttpPost]
        public List<AdmissionsModel> GetAdmissionsBySearch(SearchModel searchModel)
        {
            return this.iPreProcedureService.GetAdmissionsBySearch(searchModel);
        }

        #endregion        
    }
}
