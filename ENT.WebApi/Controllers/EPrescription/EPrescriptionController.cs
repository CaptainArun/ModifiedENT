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
    public class EPrescriptionController : Controller
    {
        public readonly IEPrescriptionService iEPrescriptionService;

        public EPrescriptionController(IEPrescriptionService _iEPrescriptionService)
        {
            iEPrescriptionService = _iEPrescriptionService;
        }

        #region Master Data

        [HttpGet]
        public List<DrugCode> GetDrugCodesforEPrescription(string searchKey)
        {
            return this.iEPrescriptionService.GetDrugCodesforEPrescription(searchKey);
        }

        [HttpGet]
        public List<DiagnosisCode> GetDiagnosisCodesforEPrescription(string searchKey)
        {
            return this.iEPrescriptionService.GetDiagnosisCodesforEPrescription(searchKey);
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRoutesforEPrescription()
        {
            return this.iEPrescriptionService.GetMedicationRoutesforEPrescription();
        }

        [HttpGet]
        public List<string> GetMedicationNumber()
        {
            return this.iEPrescriptionService.GetMedicationNumber();
        }

        #endregion

        #region Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForEPrescription(string searchKey)
        {
            return this.iEPrescriptionService.GetPatientsForEPrescription(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforEPrescription(string searchKey)
        {
            return this.iEPrescriptionService.GetProvidersforEPrescription(searchKey);
        }

        [HttpGet]
        public List<string> GetMedicationNumbersbySearch(string searchKey)
        {
            return this.iEPrescriptionService.GetMedicationNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<string> GetMedicationStatuses()
        {
            return this.iEPrescriptionService.GetMedicationStatuses();
        }

        [HttpPost]
        public List<MedicationsModel> GetMedicationsbySearch(SearchModel searchModel)
        {
            return this.iEPrescriptionService.GetMedicationsbySearch(searchModel);
        }

        [HttpGet]
        public EPrescriptionCountModel GetMedicationCounts()
        {
            return this.iEPrescriptionService.GetMedicationCounts();
        }

        #endregion

        #region Patient Data

        [HttpGet]
        public PatientDemographicModel GetPatientRecordByPatientId(int PatientId)
        {
            return this.iEPrescriptionService.GetPatientRecordByPatientId(PatientId);
        }

        #endregion

        #region Medication Requests

        [HttpGet]
        public List<MedicationRequestsModel> GetAllMedicationRequestsforPatient(int patientId)
        {
            return this.iEPrescriptionService.GetAllMedicationRequestsforPatient(patientId);
        }

        [HttpGet]
        public List<MedicationRequestsModel> GetAllMedicationRequestsforMedication()
        {
            return this.iEPrescriptionService.GetAllMedicationRequestsforMedication();
        }

        [HttpGet]
        public MedicationRequestsModel GetMedicationRequestbyId(int medicationRequestId)
        {
            return this.iEPrescriptionService.GetMedicationRequestbyId(medicationRequestId);
        }

        [HttpGet]
        public MedicationRequests ConfirmMedicationStatus(int medicationRequestId)
        {
            return this.iEPrescriptionService.ConfirmMedicationStatus(medicationRequestId);
        }

        [HttpGet]
        public MedicationRequests CancelMedicationStatus(int medicationRequestId)
        {
            return this.iEPrescriptionService.CancelMedicationStatus(medicationRequestId);
        }

        [HttpGet]
        public List<string> UserVerification(string userName, string Password)
        {
            List<string> statusData = new List<string>();
            var status = this.iEPrescriptionService.UserVerification(userName, Password);

            statusData.Add(status);

            return statusData;
        }

        #endregion

        #region Medications

        [HttpGet]
        public List<PatientVisitModel> GetVisitsbyPatientforMedication(int PatientId)
        {
            return this.iEPrescriptionService.GetVisitsbyPatientforMedication(PatientId);
        }

        [HttpPost]
        public MedicationsModel AddUpdateMedicationforEPrescription(MedicationsModel medicationsModel)
        {
            return this.iEPrescriptionService.AddUpdateMedicationforEPrescription(medicationsModel);
        }

        [HttpGet]
        public List<MedicationsModel> GetMedicationsforPatient(int patientId)
        {
            return this.iEPrescriptionService.GetMedicationsforPatient(patientId);
        }

        [HttpGet]
        public MedicationsModel GetMedicationbyMedicationNumber(string medicationNo)
        {
            return this.iEPrescriptionService.GetMedicationbyMedicationNumber(medicationNo);
        }

        [HttpGet]
        public List<MedicationsModel> GetAllMedications()
        {
            return this.iEPrescriptionService.GetAllMedications();
        }

        [HttpGet]
        public MedicationsModel GetMedicationRecordbyID(int medicationId)
        {
            return this.iEPrescriptionService.GetMedicationRecordbyID(medicationId);
        }

        [HttpGet]
        public MedicationsModel GetMedicationRecordforPreview(int medicationId)
        {
            return this.iEPrescriptionService.GetMedicationRecordforPreview(medicationId);
        }

        [HttpGet]
        public Medications CancelMedicationFromEPrescription(int medicationId)
        {
            return this.iEPrescriptionService.CancelMedicationFromEPrescription(medicationId);
        }

        [HttpGet]
        public Medications DeleteMedicationRecordbyId(int medicationId)
        {
            return this.iEPrescriptionService.DeleteMedicationRecordbyId(medicationId);
        }

        #endregion

    }
}
