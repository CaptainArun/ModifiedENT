using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface ITriageService
    {
        #region Master
        List<BPLocation> GetAllBPLocations();
        List<AllergyType> GetAllergyTypes();
        List<AllergySeverity> GetAllergySeverities();
        List<AllergyStatusMaster> GetAllergyStatusMasters();
        List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey);
        List<TreatmentCode> GetAllTreatmentCodes(string searchKey);
        List<SnomedCT> GetAllSnomedCTCodes(string searchKey);
        List<FoodIntakeType> GetAllFoodIntakeTypes();
        List<PatientEatMaster> GetAllPatientEatMasters();
        List<FoodIntakeMaster> GetAllFoodIntakeMasters();
        List<Facility> GetAllFacilitiesForTriage();
        List<Provider> GetAllProvidersForTriage();
        List<ProviderModel> GetProvidersforTriage(string searchKey);
        List<AppointmentType> GetAllAppointmentTypes();
        List<AppointmentStatus> GetAllAppointmentStatuses();
        List<ProblemArea> GetAllProblemAreavalues();
        List<ProblemType> GetAllProblemTypes();
        List<Symptoms> GetAllSymptoms();
        List<RequestedProcedure> GetAllRequestedProcedures();
        List<DispenseForm> GetDispenseFormData();
        List<DosageForm> GetDosageFormData();
        List<PatientVisitModel> GetVisitsForPatient(int PatientId);
        List<string> GetProviderNames(int facilityId);
        List<DrugCode> GetAllDrugCodes(string searchKey);
        List<FCBalance> GetBalanceListforIntake();
        List<FCMobility> GetMobilitiesforIntake();
        List<PainScale> GetPainScalesforIntake();
        List<GaitMaster> GetGaitMasterValues();
        List<TreatmentTypeMaster> GetTreatmentTypes();
        List<DrinkingMaster> GetAllDrinkingMasters();
        List<SmokingMaster> GetAllSmokingMasters();
        List<PatientPosition> GetPatientPositionsforIntake();
        List<ProblemStatus> GetProblemStatusesforCaseSheet();
        List<TemperatureLocation> GetTemperatureLocationsforIntake();
        List<ProcedureStatus> GetProcedureStatusesforCaseSheet();
        List<ProcedureType> GetProcedureTypesforCaseSheet();
        List<Procedures> GetProceduresforProcedureRequest(string searchKey);
        List<CarePlanStatusMaster> GetAllCarePlanStatusMasters();
        List<CarePlanProgressMaster> GetAllCarePlanProgressMasters();
        List<UrgencyType> GetUrgencyTypes();
        List<AdmissionType> GetAdmissionTypesforTriage();
        List<AdmissionStatus> GetAdmissionStatusforTriage();
        PatientVisitModel GetVisitRecordById(int VisitId);
        List<string> GetVisitNumbersbySearch(string searchKey);
        List<PrescriptionOrderType> GetAllPrescriptionOrderTypes();
        List<MedicationUnits> GetMedicationUnits();
        List<MedicationRoute> GetMedicationRoutes();
        List<MedicationStatus> GetAllMedicationStatus();

        #endregion

        #region Search
        TriageCountModel GetTriageCount();
        List<PatientVisitModel> GetVisitedPatientsBySearch(SearchModel searchModel);
        List<Patient> GetPatientsForTriageSearch(string searchKey);
        List<ProviderSpeciality> GetSpecialitiesForTriageSearch();

        #endregion

        #region InTake
        PatientVitalsModel AddUpdateVitalsforVisit(PatientVitalsModel vitalsModel);
        PatientAllergyModel AddUpdateAllergiesForVisit(PatientAllergyModel allergyModel);
        List<PatientAllergyModel> AddUpdateAllergyCollection(IEnumerable<PatientAllergyModel> allergycollection);
        PatientProblemListModel AddUpdateProblemListForVisit(PatientProblemListModel problemListModel);
        List<PatientProblemListModel> AddUpdateProblemListCollection(IEnumerable<PatientProblemListModel> problemListCollection);
        PatientMedicationHistoryModel AddUpdateMedicationHistoryForVisit(PatientMedicationHistoryModel medicationModel);
        List<PatientMedicationHistoryModel> AddUpdateMedicationHistoryCollection(IEnumerable<PatientMedicationHistoryModel> medicationCollection);
        PatientSocialHistoryModel AddUpdateSocialHistoryForVisit(PatientSocialHistoryModel socialModel);
        ROSModel AddUpdateROSForVisit(ROSModel rosModel);
        NutritionAssessmentModel AddUpdateNutritionForVisit(NutritionAssessmentModel nutritionModel);
        List<NutritionAssessmentModel> AddUpdateNutritionCollection(IEnumerable<NutritionAssessmentModel> nutritionCollection);
        CognitiveModel AddUpdateFunctionalandCognitiveForVisit(CognitiveModel cognitiveModel);
        NursingSignOffModel AddUpdateNursingSignOffData(NursingSignOffModel nursingModel);
        VisitIntakeModel GetVisitIntakeDataForVisit(int PatientID, int VisitID);
        PatientAllergy DeleteAllergyRecord(int AllergyId);
        PatientProblemList DeletePatientProblemRecord(int problemListId);
        NutritionAssessment DeleteNutritionRecord(int nutritionAssessmentId);
        PatientMedicationHistory DeleteMedicationHistoryRecordbyID(int patientMedicationId);

        #endregion

        #region VisitCaseCheet

        PatientCaseSheetModel GetcaseSheetDataForVisit(int VisitId);
        DiagnosisModel GetDiagnosisRecordwithImages(int visitId);
        List<PatientVisitModel> GetPreviousVisitsbyVisitId(int VisitId);
        OPDNursingorderModel GetOPDNursingDataForVisit(int VisitId);
        DiagnosisModel AddUpdateDiagnosisForVisitcase(DiagnosisModel diagModel);
        CaseSheetProcedureModel AddUpdateProcedureForVisitcase(CaseSheetProcedureModel procedureModel);
        CarePlanModel AddUpdateCarePlanForVisitCase(CarePlanModel careModel);
        OPDNursingorderModel AddUpdateOPDNursingOrders(OPDNursingorderModel nursingModel);

        AudiologyDataModel GetAudiologyRecords(int VisitId);

        #region Procedure Request

        ProcedureRequestModel AddUpdateProcedureRequest(ProcedureRequestModel procedureRequestModel);
        ProcedureRequestModel GetProcedureRequestforVisit(int visitId);

        #endregion

        #region Audiology Request 
        List<ProviderModel> GetAudiologyDoctors(string searchKey);
        AudiologyRequestModel AddUpdateAudiologyRequest(AudiologyRequestModel audiologyRequestModel);
        List<AudiologyRequestModel> GetAudiologyRequestsForPatient(int patientId);
        AudiologyRequestModel GetAudiologyRequestRecordbyVisitID(int visitId);
        #endregion

        #region E - Prescription => (Medication Request)

        MedicationRequestsModel AddUpdateMedicationRequestforVisit(MedicationRequestsModel medicationRequestsModel);
        MedicationRequestsModel GetMedicationRequestForVisit(int VisitId);
        MedicationRequests CancelMedicationRequestFromTriage(int medicationRequestId);

        #endregion

        #region e Lab Request - Triage

        List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromTriage(string searchKey);
        eLabRequestModel AddUpdateELabRequestfromTriage(eLabRequestModel elabRequest);
        eLabRequestModel GetELabRequestforVisit(int visitId);
        eLabRequestModel GetELabRequestbyIdfromTriage(int labRequestId);

        #endregion

        #endregion

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);

        #endregion

        #region SignOff

        Task<SigningOffModel> SignoffUpdationforTriage(SigningOffModel signOffModel);

        #endregion

    }
}
