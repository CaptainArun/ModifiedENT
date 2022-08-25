using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IPreProcedureService
    {
        #region Master Data 

        List<DrugCode> GetDrugCodes(string searchKey);
        List<Provider> GetProviderListForPreProcedure();
        List<ProviderModel> GetProvidersforPreProcedure(string searchKey);
        List<TenantSpeciality> GetTenantSpecialitiesforPreProcedure();
        List<string> GetProviderNamesforPreProcedure(int facilityId);
        List<RecordedDuring> GetRecordedDuringOptionsforPreProcedure();
        List<AdmissionsModel> GetAdmissionDataforDrugChart();
        List<MedicationRoute> GetMedicationRoutesforPreProcedure();
        List<string> GetAdmissionNumbersbySearch(string searchKey);

        #endregion

        #region Anesthesia Fitness

        AnesthesiafitnessModel AddUpdateAnesthesiaFitness(AnesthesiafitnessModel anesthesiafitnessModel);
        List<AnesthesiafitnessModel> GetAnesthesiafitnessList();
        List<AnesthesiafitnessModel> GetAnesthesiafitnessListforPatient(int patientId);
        AnesthesiafitnessModel GetAnesthesiafitnessRecordbyID(int anesthesiafitnessId);
        AnesthesiafitnessModel GetAnesthesiafitnessRecordbyAdmissionID(int admissionID);
        Anesthesiafitness DeleteAnesthesiaRecordbyId(int anesthesiafitnessId);

        #endregion

        #region Drug Chart

        DrugChartModel AddUpdateDrugChartData(DrugChartModel drugChartModel);
        IEnumerable<DrugChartModel> UpdateAdministrationDrugChart(IEnumerable<DrugChartModel> drugChartCollection);
        List<DrugChartModel> GetDrugChartList();
        List<DrugChartModel> GetDrugChartListforPreProcedure();
        List<DrugChartModel> GetDrugChartListforPreProcedurebyAdmissionNumber(string admissionNo);
        DrugChartModel GetDrugChartRecordbyId(int drugChartId);
        DrugChart DeleteDrugChartRecordbyId(int drugChartId);

        #endregion

        List<AdmissionsModel> GetAllAdmissionsforPreProcedure();
        AdmissionsModel GetPreProcedureAdmissionRecordbyId(int admissionId);

        Task<SigningOffModel> SignoffUpdationforPreProcedureCare(SigningOffModel procedureCareSignOffModel);

        #region Pre Procedure

        PreProcedureModel AddUpdatePreProcedureData(PreProcedureModel preProcedureModel);
        List<PreProcedureModel> GetPreProceduresforPatient(int patientID);
        List<PreProcedureModel> GetAllPreProcedures();
        PreProcedureModel GetPreProcedurebyAdmissionId(int admissionId);
        PreProcedureModel GetPreProcedurebyId(int preProcedureId);
        PreProcedure CancelPreProcedure(int admissionId, string Reason);
        List<string> UserVerification(string UserName, string Password);

        #endregion

        #region PreProcedure Search and Count

        List<Patient> GetPatientsForPreProcedureSearch(string searchKey);
        List<ProviderModel> GetProvidersforPreProcedureSearch(string searchKey);
        PrePostProcedureCountModel GetTodayPreProcedureCount();
        List<AdmissionsModel> GetAdmissionsBySearch(SearchModel searchModel);

        #endregion        

    }
}
