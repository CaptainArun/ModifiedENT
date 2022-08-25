using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IDischargeService
    {
        #region Master Data

        List<DrugCode> GetDrugCodesforDischarge(string searchKey);
        List<DiagnosisCode> GetDiagnosisCodesforDischarge(string searchKey);
        List<MedicationRoute> GetMedicationRoutesforDischarge();
        List<UrgencyType> GetUrgencyTypesforDischarge();

        #endregion

        #region Search and Count

        DischargeCountModel GetDischargeCounts();
        List<Patient> GetPatientsForDischarge(string searchKey);
        List<ProviderModel> GetProvidersforDischarge(string searchKey);
        List<string> GetAdmissionNumbersbySearch(string searchKey);
        List<DischargeSummaryModel> GetDischargeRecordsbySearch(SearchModel searchModel);

        #endregion

        #region Discharge Summary 

        List<DischargeSummaryModel> GetDischargeRecords();
        DischargeSummaryModel GetDischargeSummaryRecordbyID(int dischargeSummaryId);
        DischargeSummaryModel GetDischargeRecordbyAdmissionID(int admissionID);
        DischargeSummaryModel AddUpdateDischargeSummaryRecord(DischargeSummaryModel dischargeSummaryModel);

        #endregion

        #region Patient data

        PatientDemographicModel GetPatientDetailByPatientId(int PatientId);

        #endregion

        #region Medication Request => (E - Prescription)

        MedicationRequestsModel AddUpdateMedicationRequestforDischarge(MedicationRequestsModel medicationRequestsModel);
        MedicationRequestsModel GetMedicationRequestForAdmission(int admissionId);
        MedicationRequests CancelMedicationRequestFromDischarge(int medicationRequestId);

        #endregion

        #region e Lab Request - Discharge

        List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromDischarge(string searchKey);
        eLabRequestModel AddUpdateELabRequestfromDischarge(eLabRequestModel elabRequest);
        eLabRequestModel GetELabRequestforAdmission(int admissionId);
        eLabRequestModel GetELabRequestbyIdfromDischarge(int labRequestId);

        #endregion

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);

        #endregion

        #region SignOff

        Task<SigningOffModel> SignoffUpdationforDischarge(SigningOffModel signOffModel);

        #endregion
    }
}
