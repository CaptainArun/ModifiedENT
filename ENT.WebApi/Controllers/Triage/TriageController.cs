using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class TriageController : Controller
    {
        public readonly ITriageService iTriageService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public TriageController(ITriageService _iTriageService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iTriageService = _iTriageService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master

        [HttpGet]
        public List<BPLocation> GetAllBPLocations()
        {
            return this.iTriageService.GetAllBPLocations();
        }

        [HttpGet]
        public List<AllergyType> GetAllergyTypes()
        {
            return this.iTriageService.GetAllergyTypes();
        }

        [HttpGet]
        public List<AllergySeverity> GetAllergySeverities()
        {
            return this.iTriageService.GetAllergySeverities();
        }

        [HttpGet]
        public List<AllergyStatusMaster> GetAllergyStatusMasters()
        {
            return this.iTriageService.GetAllergyStatusMasters();
        }

        [HttpGet]
        public List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey)
        {
            return this.iTriageService.GetAllDiagnosisCodes(searchKey);
        }

        [HttpGet]
        public List<TreatmentCode> GetAllTreatmentCodes(string searchKey)
        {
            return this.iTriageService.GetAllTreatmentCodes(searchKey);
        }

        [HttpGet]
        public List<SnomedCT> GetAllSnomedCTCodes(string searchKey)
        {
            return this.iTriageService.GetAllSnomedCTCodes(searchKey);
        }

        [HttpGet]
        public List<FoodIntakeType> GetAllFoodIntakeTypes()
        {
            return this.iTriageService.GetAllFoodIntakeTypes();
        }

        [HttpGet]
        public List<PatientEatMaster> GetAllPatientEatMasters()
        {
            return this.iTriageService.GetAllPatientEatMasters();
        }

        [HttpGet]
        public List<FoodIntakeMaster> GetAllFoodIntakeMasters()
        {
            return this.iTriageService.GetAllFoodIntakeMasters();
        }

        [HttpGet]
        public List<Facility> GetAllFacilitiesForTriage()
        {
            return this.iTriageService.GetAllFacilitiesForTriage();
        }

        [HttpGet]
        public List<Provider> GetAllProvidersForTriage()
        {
            return this.iTriageService.GetAllProvidersForTriage();
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforTriage(string searchKey)
        {
            return this.iTriageService.GetProvidersforTriage(searchKey);
        }

        [HttpGet]
        public List<AppointmentType> GetAllAppointmentTypes()
        {
            return this.iTriageService.GetAllAppointmentTypes();
        }

        [HttpGet]
        public List<AppointmentStatus> GetAllAppointmentStatuses()
        {
            return this.iTriageService.GetAllAppointmentStatuses();
        }

        [HttpGet]
        public List<ProblemArea> GetAllProblemAreavalues()
        {
            return this.iTriageService.GetAllProblemAreavalues();
        }

        [HttpGet]
        public List<ProblemType> GetAllProblemTypes()
        {
            return this.iTriageService.GetAllProblemTypes();
        }

        [HttpGet]
        public List<Symptoms> GetAllSymptoms()
        {
            return this.iTriageService.GetAllSymptoms();
        }

        [HttpGet]
        public List<RequestedProcedure> GetAllRequestedProcedures()
        {
            return this.iTriageService.GetAllRequestedProcedures();
        }

        [HttpGet]
        public List<DispenseForm> GetDispenseFormData()
        {
            return this.iTriageService.GetDispenseFormData();
        }

        [HttpGet]
        public List<DosageForm> GetDosageFormData()
        {
            return this.iTriageService.GetDosageFormData();
        }

        [HttpGet]
        public List<PatientVisitModel> GetVisitsForPatient(int PatientId)
        {
            return this.iTriageService.GetVisitsForPatient(PatientId);
        }

        [HttpGet]
        public List<string> GetProviderNames(int facilityId)
        {
            return this.iTriageService.GetProviderNames(facilityId);
        }

        [HttpGet]
        public List<DrugCode> GetAllDrugCodes(string searchKey)
        {
            return this.iTriageService.GetAllDrugCodes(searchKey);
        }

        [HttpGet]
        public List<FCBalance> GetBalanceListforIntake()
        {
            return this.iTriageService.GetBalanceListforIntake();
        }

        [HttpGet]
        public List<FCMobility> GetMobilitiesforIntake()
        {
            return this.iTriageService.GetMobilitiesforIntake();
        }

        [HttpGet]
        public List<PainScale> GetPainScalesforIntake()
        {
            return this.iTriageService.GetPainScalesforIntake();
        }

        [HttpGet]
        public List<GaitMaster> GetGaitMasterValues()
        {
            return this.iTriageService.GetGaitMasterValues();
        }

        [HttpGet]
        public List<TreatmentTypeMaster> GetTreatmentTypes()
        {
            return this.iTriageService.GetTreatmentTypes();
        }

        [HttpGet]
        public List<DrinkingMaster> GetAllDrinkingMasters()
        {
            return this.iTriageService.GetAllDrinkingMasters();
        }

        [HttpGet]
        public List<SmokingMaster> GetAllSmokingMasters()
        {
            return this.iTriageService.GetAllSmokingMasters();
        }

        [HttpGet]
        public List<PatientPosition> GetPatientPositionsforIntake()
        {
            return this.iTriageService.GetPatientPositionsforIntake();
        }

        [HttpGet]
        public List<ProblemStatus> GetProblemStatusesforCaseSheet()
        {
            return this.iTriageService.GetProblemStatusesforCaseSheet();
        }

        [HttpGet]
        public List<TemperatureLocation> GetTemperatureLocationsforIntake()
        {
            return this.iTriageService.GetTemperatureLocationsforIntake();
        }

        [HttpGet]
        public List<ProcedureStatus> GetProcedureStatusesforCaseSheet()
        {
            return this.iTriageService.GetProcedureStatusesforCaseSheet();
        }

        [HttpGet]
        public List<ProcedureType> GetProcedureTypesforCaseSheet()
        {
            return this.iTriageService.GetProcedureTypesforCaseSheet();
        }

        [HttpGet]
        public List<Procedures> GetProceduresforProcedureRequest(string searchKey)
        {
            return this.iTriageService.GetProceduresforProcedureRequest(searchKey);
        }

        [HttpGet]
        public List<CarePlanStatusMaster> GetAllCarePlanStatusMasters()
        {
            return this.iTriageService.GetAllCarePlanStatusMasters();
        }

        [HttpGet]
        public List<CarePlanProgressMaster> GetAllCarePlanProgressMasters()
        {
            return this.iTriageService.GetAllCarePlanProgressMasters();
        }

        [HttpGet]
        public List<UrgencyType> GetUrgencyTypes()
        {
            return this.iTriageService.GetUrgencyTypes();
        }

        [HttpGet]
        public List<AdmissionType> GetAdmissionTypesforTriage()
        {
            return this.iTriageService.GetAdmissionTypesforTriage();
        }

        [HttpGet]
        public List<AdmissionStatus> GetAdmissionStatusforTriage()
        {
            return this.iTriageService.GetAdmissionStatusforTriage();
        }

        [HttpGet]
        public PatientVisitModel GetVisitRecordById(int VisitId)
        {
            return this.iTriageService.GetVisitRecordById(VisitId);
        }

        [HttpGet]
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            return this.iTriageService.GetVisitNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<PrescriptionOrderType> GetAllPrescriptionOrderTypes()
        {
            return this.iTriageService.GetAllPrescriptionOrderTypes();
        }

        [HttpGet]
        public List<MedicationUnits> GetMedicationUnits()
        {
            return this.iTriageService.GetMedicationUnits();
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRoutes()
        {
            return this.iTriageService.GetMedicationRoutes();
        }

        [HttpGet]
        public List<MedicationStatus> GetAllMedicationStatus()
        {
            return this.iTriageService.GetAllMedicationStatus();
        }

        #endregion

        #region Search

        [HttpGet]
        public TriageCountModel GetTriageCount()
        {
            return this.iTriageService.GetTriageCount();
        }

        [HttpPost]
        public List<PatientVisitModel> GetVisitedPatientsBySearch(SearchModel searchModel)
        {
            return this.iTriageService.GetVisitedPatientsBySearch(searchModel);
        }

        [HttpGet]
        public List<Patient> GetPatientsForTriageSearch(string searchKey)
        {
            return this.iTriageService.GetPatientsForTriageSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderSpeciality> GetSpecialitiesForTriageSearch()
        {
            return this.iTriageService.GetSpecialitiesForTriageSearch();
        }
        #endregion

        #region InTake

        [HttpPost]
        public PatientVitalsModel AddUpdateVitalsforVisit(PatientVitalsModel vitalsModel)
        {
            return this.iTriageService.AddUpdateVitalsforVisit(vitalsModel);
        }

        [HttpPost]
        public PatientAllergyModel AddUpdateAllergiesForVisit(PatientAllergyModel allergyModel)
        {
            return this.iTriageService.AddUpdateAllergiesForVisit(allergyModel);
        }

        [HttpPost]
        public List<PatientAllergyModel> AddUpdateAllergyCollection(IEnumerable<PatientAllergyModel> allergycollection)
        {
            return this.iTriageService.AddUpdateAllergyCollection(allergycollection);
        }

        [HttpPost]
        public PatientProblemListModel AddUpdateProblemListForVisit(PatientProblemListModel problemListModel)
        {
            return this.iTriageService.AddUpdateProblemListForVisit(problemListModel);
        }

        [HttpPost]
        public List<PatientProblemListModel> AddUpdateProblemListCollection(IEnumerable<PatientProblemListModel> problemListCollection)
        {
            return this.iTriageService.AddUpdateProblemListCollection(problemListCollection);
        }

        [HttpPost]
        public PatientMedicationHistoryModel AddUpdateMedicationHistoryForVisit(PatientMedicationHistoryModel medicationModel)
        {
            return this.iTriageService.AddUpdateMedicationHistoryForVisit(medicationModel);
        }

        [HttpPost]
        public List<PatientMedicationHistoryModel> AddUpdateMedicationHistoryCollection(IEnumerable<PatientMedicationHistoryModel> medicationCollection)
        {
            return this.iTriageService.AddUpdateMedicationHistoryCollection(medicationCollection);
        }

        [HttpPost]
        public PatientSocialHistoryModel AddUpdateSocialHistoryForVisit(PatientSocialHistoryModel socialModel)
        {
            return this.iTriageService.AddUpdateSocialHistoryForVisit(socialModel);
        }

        [HttpPost]
        public ROSModel AddUpdateROSForVisit(ROSModel rosModel)
        {
            return this.iTriageService.AddUpdateROSForVisit(rosModel);
        }

        [HttpPost]
        public NutritionAssessmentModel AddUpdateNutritionForVisit(NutritionAssessmentModel nutritionModel)
        {
            return this.iTriageService.AddUpdateNutritionForVisit(nutritionModel);
        }

        [HttpPost]
        public List<NutritionAssessmentModel> AddUpdateNutritionCollection(IEnumerable<NutritionAssessmentModel> nutritionCollection)
        {
            return this.iTriageService.AddUpdateNutritionCollection(nutritionCollection);
        }

        [HttpPost]
        public CognitiveModel AddUpdateFunctionalandCognitiveForVisit(CognitiveModel cognitiveModel)
        {
            return this.iTriageService.AddUpdateFunctionalandCognitiveForVisit(cognitiveModel);
        }

        [HttpPost]
        public NursingSignOffModel AddUpdateNursingSignOffData(NursingSignOffModel nursingModel)
        {

            return this.iTriageService.AddUpdateNursingSignOffData(nursingModel);

        }

        [HttpGet]
        public VisitIntakeModel GetVisitIntakeDataForVisit(int PatientID, int VisitID)
        {
            return this.iTriageService.GetVisitIntakeDataForVisit(PatientID, VisitID);
        }

        [HttpGet]
        public PatientAllergy DeleteAllergyRecord(int AllergyId)
        {
            return this.iTriageService.DeleteAllergyRecord(AllergyId);
        }

        [HttpGet]
        public PatientProblemList DeletePatientProblemRecord(int problemListId)
        {
            return this.iTriageService.DeletePatientProblemRecord(problemListId);
        }

        [HttpGet]
        public NutritionAssessment DeleteNutritionRecord(int nutritionAssessmentId)
        {
            return this.iTriageService.DeleteNutritionRecord(nutritionAssessmentId);
        }

        [HttpGet]
        public PatientMedicationHistory DeleteMedicationHistoryRecordbyID(int patientMedicationId)
        {
            return this.iTriageService.DeleteMedicationHistoryRecordbyID(patientMedicationId);
        }

        #endregion

        #region VisitCaseSheet

        [HttpGet]
        public PatientCaseSheetModel GetcaseSheetDataForVisit(int VisitId)
        {
            return this.iTriageService.GetcaseSheetDataForVisit(VisitId);
        }

        [HttpGet]
        public DiagnosisModel GetDiagnosisRecordwithImages(int visitId)
        {
            return this.iTriageService.GetDiagnosisRecordwithImages(visitId);
        }

        [HttpGet]
        public List<PatientVisitModel> GetPreviousVisitsbyVisitId(int VisitId)
        {
            return this.iTriageService.GetPreviousVisitsbyVisitId(VisitId);
        }

        [HttpGet]
        public OPDNursingorderModel GetOPDNursingDataForVisit(int VisitId)
        {
            return this.iTriageService.GetOPDNursingDataForVisit(VisitId);
        }


        [HttpPost]
        public DiagnosisModel AddUpdateDiagnosisForVisitcase(DiagnosisModel diagModel)
        {
            return this.iTriageService.AddUpdateDiagnosisForVisitcase(diagModel);
        }

        [HttpPost]
        public CaseSheetProcedureModel AddUpdateProcedureForVisitcase(CaseSheetProcedureModel procedureModel)
        {
            return this.iTriageService.AddUpdateProcedureForVisitcase(procedureModel);
        }

        [HttpPost]
        public CarePlanModel AddUpdateCarePlanForVisitCase(CarePlanModel careModel)
        {
            return this.iTriageService.AddUpdateCarePlanForVisitCase(careModel);
        }

        [HttpPost]
        public OPDNursingorderModel AddUpdateOPDNursingOrders(OPDNursingorderModel nursingModel)
        {
            return this.iTriageService.AddUpdateOPDNursingOrders(nursingModel);
        }


        [HttpGet]
        public AudiologyDataModel GetAudiologyRecords(int VisitId)
        {
            return this.iTriageService.GetAudiologyRecords(VisitId);
        }

        #region Procedure Request

        [HttpPost]
        public ProcedureRequestModel AddUpdateProcedureRequest(ProcedureRequestModel procedureRequestModel)
        {
            return this.iTriageService.AddUpdateProcedureRequest(procedureRequestModel);
        }

        [HttpGet]
        public ProcedureRequestModel GetProcedureRequestforVisit(int visitId)
        {
            return this.iTriageService.GetProcedureRequestforVisit(visitId);
        }

        #endregion

        #region Audiology Request 

        [HttpGet]
        public List<ProviderModel> GetAudiologyDoctors(string searchKey)
        {
            return this.iTriageService.GetAudiologyDoctors(searchKey);
        }

        [HttpPost]
        public AudiologyRequestModel AddUpdateAudiologyRequest(AudiologyRequestModel audiologyRequestModel)
        {
            return this.iTriageService.AddUpdateAudiologyRequest(audiologyRequestModel);
        }

        [HttpGet]
        public List<AudiologyRequestModel> GetAudiologyRequestsForPatient(int patientId)
        {
            return this.iTriageService.GetAudiologyRequestsForPatient(patientId);
        }

        [HttpGet]
        public AudiologyRequestModel GetAudiologyRequestRecordbyVisitID(int visitId)
        {
            return this.iTriageService.GetAudiologyRequestRecordbyVisitID(visitId);
        }

        #endregion

        #region E - Prescription => (Medication Request)

        [HttpPost]
        public MedicationRequestsModel AddUpdateMedicationRequestforVisit(MedicationRequestsModel medicationRequestsModel)
        {
            return this.iTriageService.AddUpdateMedicationRequestforVisit(medicationRequestsModel);
        }

        [HttpGet]
        public MedicationRequestsModel GetMedicationRequestForVisit(int VisitId)
        {
            return this.iTriageService.GetMedicationRequestForVisit(VisitId);
        }

        [HttpGet]
        public MedicationRequests CancelMedicationRequestFromTriage(int medicationRequestId)
        {
            return this.iTriageService.CancelMedicationRequestFromTriage(medicationRequestId);
        }

        #endregion

        #region e Lab Request - Triage

        [HttpGet]
        public List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromTriage(string searchKey)
        {
            return this.iTriageService.GetELabSetupMastersbySearchfromTriage(searchKey);
        }

        [HttpPost]
        public eLabRequestModel AddUpdateELabRequestfromTriage(eLabRequestModel elabRequest)
        {
            return this.iTriageService.AddUpdateELabRequestfromTriage(elabRequest);
        }

        [HttpGet]
        public eLabRequestModel GetELabRequestforVisit(int visitId)
        {
            return this.iTriageService.GetELabRequestforVisit(visitId);
        }

        [HttpGet]
        public eLabRequestModel GetELabRequestbyIdfromTriage(int labRequestId)
        {
            return this.iTriageService.GetELabRequestbyIdfromTriage(labRequestId);
        }

        #endregion

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
        public List<clsViewFile> GetFile(string Id, string screen)
        {
            return this.iTriageService.GetFile(Id, screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iTriageService.DeleteFile(path, fileName);
        }

        #endregion

        [HttpPost]
        public Task<SigningOffModel> SignoffUpdationforTriage(SigningOffModel signOffModel)
        {
            return this.iTriageService.SignoffUpdationforTriage(signOffModel);
        }

    }
}