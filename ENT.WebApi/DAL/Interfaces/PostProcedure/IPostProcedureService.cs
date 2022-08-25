using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IPostProcedureService
    {
        #region Master Data 

        List<DrugCode> GetDrugCodesforPostProcedureCasesheet(string searchKey);
        List<RecordedDuring> GetRecordedDuringOptionsforPostProcedure();
        List<TreatmentCode> GetProcedureCodes(string searchKey);
        List<Procedures> GetProceduresforPostProcedure(string searchKey);
        List<TenantSpeciality> GetTenantSpecialitiesforPostProcedure();
        List<PatientArrivalCondition> GetPatientArrivalConditionsforPostProcedure();
        List<PainScale> GetPainLevelsforPostProcedure();
        List<ProviderModel> GetProvidersforPostProcedure(string searchKey);
        List<MedicationRoute> GetMedicationRoutesforPostProcedure();
        List<string> GetAdmissionNumbersbySearch(string searchKey);

        #endregion

        #region Drug Chart 

        DrugChartModel AddUpdateDrugChartDatafromPostProcedure(DrugChartModel drugChartModel);
        IEnumerable<DrugChartModel> UpdateAdministrationDrugChartfromPostProcedure(IEnumerable<DrugChartModel> drugChartCollection);
        List<DrugChartModel> GetDrugChartListforPostProcedure();
        List<DrugChartModel> GetDrugChartListforPostProcedurebyAdmissionNumber(string admissionNo);
        DrugChartModel GetDrugChartRecordfromPostProcedurebyId(int drugChartId);
        DrugChart DeleteDrugChartRecordfromPostProcedurebyId(int drugChartId);

        #endregion

        #region Post Procedure Case Sheet

        PostProcedureCaseSheetModel AddUpdatePostProcedureCaseSheetData(PostProcedureCaseSheetModel postProcedureCaseSheetModel);
        List<PostProcedureCaseSheetModel> GetPostProcedureCaseSheetsforPatient(int patientID);
        List<PostProcedureCaseSheetModel> GetAllPostProcedureCaseSheetData();
        PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyAdmissionId(int admissionId);
        PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyId(int postProcedureId);

        #endregion

        #region Post Procedure Search and Count

        List<Patient> GetPatientsForPostProcedureSearch(string searchKey);
        List<ProviderModel> GetProvidersforPostProcedureSearch(string searchKey);
        PrePostProcedureCountModel GetTodayPostProcedureCount();
        List<PreProcedureModel> GetPreProceduresBySearch(SearchModel searchModel);

        #endregion

        List<PreProcedureModel> GetPreProceduresforPostProcedure();
        AdmissionsModel GetAdmissionRecordbyId(int admissionId);
        Task<SigningOffModel> SignoffUpdationforPostProcedureCare(SigningOffModel procedureCareSignOffModel);

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);
        #endregion
    }
}
