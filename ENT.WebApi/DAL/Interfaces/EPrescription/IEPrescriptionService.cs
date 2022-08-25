using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IEPrescriptionService
    {

        #region Master Data

        List<DrugCode> GetDrugCodesforEPrescription(string searchKey);
        List<DiagnosisCode> GetDiagnosisCodesforEPrescription(string searchKey);
        List<MedicationRoute> GetMedicationRoutesforEPrescription();
        List<string> GetMedicationNumber();

        #endregion

        #region Search and Count

        List<Patient> GetPatientsForEPrescription(string searchKey);
        List<ProviderModel> GetProvidersforEPrescription(string searchKey);
        List<string> GetMedicationNumbersbySearch(string searchKey);
        List<string> GetMedicationStatuses();
        List<MedicationsModel> GetMedicationsbySearch(SearchModel searchModel);
        EPrescriptionCountModel GetMedicationCounts();

        #endregion

        #region Patient Data

        PatientDemographicModel GetPatientRecordByPatientId(int PatientId);

        #endregion

        #region Medication Requests

        List<MedicationRequestsModel> GetAllMedicationRequestsforPatient(int patientId);
        List<MedicationRequestsModel> GetAllMedicationRequestsforMedication();
        MedicationRequestsModel GetMedicationRequestbyId(int medicationRequestId);
        MedicationRequests ConfirmMedicationStatus(int medicationRequestId);
        MedicationRequests CancelMedicationStatus(int medicationRequestId);
        string UserVerification(string userName, string Password);

        #endregion

        #region Medications

        List<PatientVisitModel> GetVisitsbyPatientforMedication(int PatientId);
        MedicationsModel AddUpdateMedicationforEPrescription(MedicationsModel medicationsModel);
        List<MedicationsModel> GetMedicationsforPatient(int patientId);
        MedicationsModel GetMedicationbyMedicationNumber(string medicationNo);
        List<MedicationsModel> GetAllMedications();
        MedicationsModel GetMedicationRecordbyID(int medicationId);
        MedicationsModel GetMedicationRecordforPreview(int medicationId);
        Medications CancelMedicationFromEPrescription(int medicationId);
        Medications DeleteMedicationRecordbyId(int medicationId);

        #endregion
    }
}
