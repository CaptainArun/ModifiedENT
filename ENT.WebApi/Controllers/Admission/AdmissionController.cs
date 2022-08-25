using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AdmissionController : Controller
    {
        public readonly IAdmissionService iAdmissionService;

        public AdmissionController(IAdmissionService _iAdmissionService)
        {
            iAdmissionService = _iAdmissionService;
        }

        #region Master Data

        [HttpGet]
        public List<TreatmentCode> GetTreatmentCodes(string searchKey)
        {
            return this.iAdmissionService.GetTreatmentCodes(searchKey);
        }

        [HttpGet]
        public List<DiagnosisCode> GetDiagnosisCodes(string searchKey)
        {
            return this.iAdmissionService.GetDiagnosisCodes(searchKey);
        }

        [HttpGet]
        public List<TenantSpeciality> GetSpecialities()
        {
            return this.iAdmissionService.GetSpecialities();
        }

        [HttpGet]
        public List<PatientArrivalCondition> GetPatientArrivalConditions()
        {
            return this.iAdmissionService.GetPatientArrivalConditions();
        }

        [HttpGet]
        public List<string> GetProviderNamesForAdmission(int facilityId)
        {
            return this.iAdmissionService.GetProviderNamesForAdmission(facilityId);
        }

        [HttpGet]
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            return this.iAdmissionService.GetProvidersbyFacility(facilityID);
        }

        [HttpGet]
        public List<Facility> GetFacilitiesforAdmissions()
        {
            return this.iAdmissionService.GetFacilitiesforAdmissions();
        }

        [HttpGet]
        public List<Provider> GetAllProvidersForAdmission()
        {
            return this.iAdmissionService.GetAllProvidersForAdmission();
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforAdmission(string searchKey)
        {
            return this.iAdmissionService.GetProvidersforAdmission(searchKey);
        }

        [HttpGet]
        public List<ProcedureType> GetProcedureTypesforAdmission()
        {
            return this.iAdmissionService.GetProcedureTypesforAdmission();
        }


        [HttpGet]
        public List<Procedures> GetProceduresforAdmission(string searchKey)
        {
            return this.iAdmissionService.GetProceduresforAdmission(searchKey);
        }

        [HttpGet]
        public List<UrgencyType> GetUrgencyTypesforAdmission()
        {
            return this.iAdmissionService.GetUrgencyTypesforAdmission();
        }

        [HttpGet]
        public List<AdmissionType> GetAdmissionTypesforAdmission()
        {
            return this.iAdmissionService.GetAdmissionTypesforAdmission();
        }

        [HttpGet]
        public List<AdmissionStatus> GetAdmissionStatusesforAdmission()
        {
            return this.iAdmissionService.GetAdmissionStatusesforAdmission();
        }

        [HttpGet]
        public List<PatientArrivalBy> GetPatientArrivalbyValues()
        {
            return this.iAdmissionService.GetPatientArrivalbyValues();
        }

        [HttpGet]
        public List<string> GetAdmissionNumber()
        {
            return this.iAdmissionService.GetAdmissionNumber();
        }

        [HttpGet]
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            return this.iAdmissionService.GetVisitNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<PaymentType> GetPaymentTypeListforAdmission()
        {
            return this.iAdmissionService.GetPaymentTypeListforAdmission();
        }

        [HttpGet]
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            return this.iAdmissionService.GetAdmissionNumbersbySearch(searchKey);
        }

        #endregion

        #region Procedure Request for Admission

        [HttpGet]
        public List<ProcedureRequestModel> GetProcedureRequestsforAdmission()
        {
            return this.iAdmissionService.GetProcedureRequestsforAdmission();
        }

        [HttpPost]
        public List<ProcedureRequestModel> GetProcedureRequestsforAdmissionBySearch(SearchModel searchModel)
        {
            return this.iAdmissionService.GetProcedureRequestsforAdmissionBySearch(searchModel);
        }

        [HttpGet]
        public AdmissionCountModel GetProcedureRequestCounts()
        {
            return this.iAdmissionService.GetProcedureRequestCounts();
        }

        [HttpGet]
        public List<ProcedureRequestModel> GetProcedureRequestsforPatient(int patientId)
        {
            return this.iAdmissionService.GetProcedureRequestsforPatient(patientId);
        }

        [HttpGet]
        public ProcedureRequestModel GetProcedureRequestbyId(int procedureRequestId)
        {
            return this.iAdmissionService.GetProcedureRequestbyId(procedureRequestId);
        }

        [HttpGet]
        public ProcedureRequest ConfirmProcedureStatus(int procedureRequestId)
        {
            return this.iAdmissionService.ConfirmProcedureStatus(procedureRequestId);
        }

        #endregion

        #region Admissions

        [HttpPost]
        public AdmissionsModel AddUpdateAdmissions(AdmissionsModel admissionsModel)
        {
            return this.iAdmissionService.AddUpdateAdmissions(admissionsModel);
        }

        [HttpGet]
        public List<AdmissionsModel> GetAllAdmissions()
        {
            return this.iAdmissionService.GetAllAdmissions();
        }

        [HttpGet]
        public List<AdmissionsModel> GetAllAdmissionsForPatient(int PatientId)
        {
            return this.iAdmissionService.GetAllAdmissionsForPatient(PatientId);
        }

        [HttpGet]
        public AdmissionsModel GetAdmissionDetailByID(int admissionID)
        {
            return this.iAdmissionService.GetAdmissionDetailByID(admissionID);
        }

        [HttpGet]
        public Admissions DeleteAdmissionRecord(int admissionID)
        {
            return this.iAdmissionService.DeleteAdmissionRecord(admissionID);
        }

        #endregion

        #region Admission Search and Count 

        [HttpGet]
        public AdmissionCountModel GetAdmissionCounts()
        {
            return this.iAdmissionService.GetAdmissionCounts();
        }

        [HttpPost]
        public List<AdmissionsModel> GetAdmissionsBySearch(SearchModel searchModel)
        {
            return this.iAdmissionService.GetAdmissionsBySearch(searchModel);
        }

        [HttpGet]
        public List<Patient> GetPatientsForAdmissionSearch(string searchKey)
        {
            return this.iAdmissionService.GetPatientsForAdmissionSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforAdmissionSearch(string searchKey)
        {
            return this.iAdmissionService.GetProvidersforAdmissionSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderSpeciality> GetSpecialitiesForAdmissionSearch()
        {
            return this.iAdmissionService.GetSpecialitiesForAdmissionSearch();
        }

        #endregion

        #region Admission Payment

        [HttpGet]
        public List<BillingSetupMasterModel> GetbillingParticularsforAdmissionPayment(int departmentID, string searchKey)
        {
            return this.iAdmissionService.GetbillingParticularsforAdmissionPayment(departmentID, searchKey);
        }

        [HttpPost]
        public AdmissionPaymentModel AddUpdateAdmissionPayment(AdmissionPaymentModel paymentModel)
        {
            return this.iAdmissionService.AddUpdateAdmissionPayment(paymentModel);
        }

        [HttpGet]
        public List<AdmissionPaymentModel> GetAllAdmissionPayments()
        {
            return this.iAdmissionService.GetAllAdmissionPayments();
        }

        [HttpGet]
        public AdmissionPaymentModel GetPaymentRecordforAdmissionbyID(int admissionID)
        {
            return this.iAdmissionService.GetPaymentRecordforAdmissionbyID(admissionID);
        }

        [HttpGet]
        public List<AdmissionPaymentModel> GetAdmissionPaymentsforPatient(int PatientId)
        {
            return this.iAdmissionService.GetAdmissionPaymentsforPatient(PatientId);
        }

        [HttpGet]
        public AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentId)
        {
            return this.iAdmissionService.GetAdmissionPaymentRecordbyID(admissionPaymentId);
        }

        #endregion

    }
}
