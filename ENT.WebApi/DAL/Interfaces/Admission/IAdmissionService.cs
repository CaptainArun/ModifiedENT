using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IAdmissionService
    {
        #region Master Data
        List<TreatmentCode> GetTreatmentCodes(string searchKey);
        List<DiagnosisCode> GetDiagnosisCodes(string searchKey);
        List<TenantSpeciality> GetSpecialities();
        List<PatientArrivalCondition> GetPatientArrivalConditions();
        List<string> GetProviderNamesForAdmission(int facilityId);
        List<Provider> GetProvidersbyFacility(int facilityID);
        List<Facility> GetFacilitiesforAdmissions();
        List<Provider> GetAllProvidersForAdmission();
        List<ProviderModel> GetProvidersforAdmission(string searchKey);
        List<ProcedureType> GetProcedureTypesforAdmission();
        List<Procedures> GetProceduresforAdmission(string searchKey);
        List<UrgencyType> GetUrgencyTypesforAdmission();
        List<AdmissionType> GetAdmissionTypesforAdmission();
        List<AdmissionStatus> GetAdmissionStatusesforAdmission();
        List<PatientArrivalBy> GetPatientArrivalbyValues();
        List<string> GetAdmissionNumber();
        List<string> GetVisitNumbersbySearch(string searchKey);
        List<PaymentType> GetPaymentTypeListforAdmission();
        List<string> GetAdmissionNumbersbySearch(string searchKey);

        #endregion


        #region Procedure Request for Admission

        List<ProcedureRequestModel> GetProcedureRequestsforAdmission();
        List<ProcedureRequestModel> GetProcedureRequestsforAdmissionBySearch(SearchModel searchModel);
        AdmissionCountModel GetProcedureRequestCounts();
        List<ProcedureRequestModel> GetProcedureRequestsforPatient(int patientId);
        ProcedureRequestModel GetProcedureRequestbyId(int procedureRequestId);
        ProcedureRequest ConfirmProcedureStatus(int procedureRequestId);

        #endregion

        #region Admissions
        AdmissionsModel AddUpdateAdmissions(AdmissionsModel admissionsModel);
        List<AdmissionsModel> GetAllAdmissions();
        List<AdmissionsModel> GetAllAdmissionsForPatient(int PatientId);
        AdmissionsModel GetAdmissionDetailByID(int admissionID);
        Admissions DeleteAdmissionRecord(int admissionID);

        #endregion

        #region Admission Search and Count

        AdmissionCountModel GetAdmissionCounts();
        List<AdmissionsModel> GetAdmissionsBySearch(SearchModel searchModel);
        List<Patient> GetPatientsForAdmissionSearch(string searchKey);
        List<ProviderModel> GetProvidersforAdmissionSearch(string searchKey);
        List<ProviderSpeciality> GetSpecialitiesForAdmissionSearch();

        #endregion

        #region Admission Payment

        List<BillingSetupMasterModel> GetbillingParticularsforAdmissionPayment(int departmentID, string searchKey);
        AdmissionPaymentModel AddUpdateAdmissionPayment(AdmissionPaymentModel paymentModel);
        List<AdmissionPaymentModel> GetAllAdmissionPayments();
        AdmissionPaymentModel GetPaymentRecordforAdmissionbyID(int admissionID);
        List<AdmissionPaymentModel> GetAdmissionPaymentsforPatient(int PatientId);
        AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentId);

        #endregion
    }
}
