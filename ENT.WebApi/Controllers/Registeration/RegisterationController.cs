using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using System.Web;
using System.Net;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Net.Http.Headers;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class RegisterationController : Controller
    {
        public readonly IRegisterationService iRegisterationService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public RegisterationController(IRegisterationService _iRegisterationService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iRegisterationService = _iRegisterationService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        [HttpGet]
        public List<Gender> GetGendersForPatient()
        {
            return this.iRegisterationService.GetGendersForPatient();
        }

        [HttpGet]
        public List<Salutation> GetSalutationsforPatient()
        {
            return this.iRegisterationService.GetSalutationsforPatient();
        }

        [HttpGet]
        public List<State> GetStateListforPatient()
        {
            return this.iRegisterationService.GetStateListforPatient();
        }

        [HttpGet]
        public List<Country> GetCountryListforPatient()
        {
            return this.iRegisterationService.GetCountryListforPatient();
        }

        [HttpGet]
        public List<TreatmentCode> GetCPTCodesbySearch(string searchKey)
        {
            return this.iRegisterationService.GetCPTCodesbySearch(searchKey);
        }

        [HttpGet]
        public List<DiagnosisCode> GetICDCodesbySearch(string searchKey)
        {
            return this.iRegisterationService.GetICDCodesbySearch(searchKey);
        }

        [HttpGet]
        public List<DischargeCode> GetDischargeCodesbySearch(string searchkey)
        {
            return this.iRegisterationService.GetDischargeCodesbySearch(searchkey);
        }

        [HttpGet]
        public List<string> GetProviderNames(int facilityId)
        {
            return this.iRegisterationService.GetProviderNames(facilityId);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforRegisteration(string searchKey)
        {
            return this.iRegisterationService.GetProvidersforRegisteration(searchKey);
        }

        [HttpGet]
        public List<Relationshiptopatient> GetAllRelations()
        {
            return this.iRegisterationService.GetAllRelations();
        }

        [HttpGet]
        public List<IdentificationIdType> GetIdentificationTypes()
        {
            return this.iRegisterationService.GetIdentificationTypes();
        }

        [HttpGet]
        public List<PatientCategory> GetAllPatientCategories()
        {
            return this.iRegisterationService.GetAllPatientCategories();
        }

        [HttpGet]
        public List<PatientType> GetAllPatientTypes()
        {
            return this.iRegisterationService.GetAllPatientTypes();
        }

        [HttpGet]
        public List<FamilyHistoryStatusMaster> GetAllFamilyHistoryStatusMasters()
        {
            return this.iRegisterationService.GetAllFamilyHistoryStatusMasters();
        }

        [HttpGet]
        public List<MaritalStatus> GetMaritalStatusesForPatient()
        {
            return this.iRegisterationService.GetMaritalStatusesForPatient();
        }

        [HttpGet]
        public List<ContactType> GetContactTypesForPatient()
        {
            return this.iRegisterationService.GetContactTypesForPatient();
        }

        [HttpGet]
        public List<Religion> GetReligionsForPatient()
        {
            return this.iRegisterationService.GetReligionsForPatient();
        }

        [HttpGet]
        public List<Race> GetRacesForPatient()
        {
            return this.iRegisterationService.GetRacesForPatient();
        }

        [HttpGet]
        public List<BloodGroup> GetBloodGroupsforPatient()
        {
            return this.iRegisterationService.GetBloodGroupsforPatient();
        }

        [HttpGet]
        public List<IllnessType> GetIllnessTypesforPatient()
        {
            return this.iRegisterationService.GetIllnessTypesforPatient();
        }

        [HttpGet]
        public List<AdmissionType> GetAdmissionTypesforRegisteration()
        {
            return this.iRegisterationService.GetAdmissionTypesforRegisteration();
        }

        [HttpGet]
        public List<AdmissionStatus> GetAdmissionStatusforRegisteration()
        {
            return this.iRegisterationService.GetAdmissionStatusforRegisteration();
        }

        [HttpGet]
        public List<ProblemStatus> GetProblemStatusesforRegisteration()
        {
            return this.iRegisterationService.GetProblemStatusesforRegisteration();
        }

        [HttpGet]
        public List<ProcedureType> GetProcedureTypesforRegisteration()
        {
            return this.iRegisterationService.GetProcedureTypesforRegisteration();
        }

        [HttpGet]
        public List<InsuranceType> GetInsuranceTypesforPatient()
        {
            return this.iRegisterationService.GetInsuranceTypesforPatient();
        }

        [HttpGet]
        public List<InsuranceCategory> GetInsuranceCategoriesforPatient()
        {
            return this.iRegisterationService.GetInsuranceCategoriesforPatient();
        }

        [HttpGet]
        public List<RadiologyProcedureRequested> GetRadiologyProcedureRequestedforPatient()
        {
            return this.iRegisterationService.GetRadiologyProcedureRequestedforPatient();
        }

        [HttpGet]
        public List<RadiologyType> GetRadiologyTypesforPatient()
        {
            return this.iRegisterationService.GetRadiologyTypesforPatient();
        }

        [HttpGet]
        public List<ReferredLab> GetReferredLabsforPatient()
        {
            return this.iRegisterationService.GetReferredLabsforPatient();
        }

        [HttpGet]
        public List<BodySection> GetBodySectionsforPatient()
        {
            return this.iRegisterationService.GetBodySectionsforPatient();
        }

        [HttpGet]
        public List<ReportFormat> GetReportFormatsforPatient()
        {
            return this.iRegisterationService.GetReportFormatsforPatient();
        }

        [HttpGet]
        public List<BodySite> GetBodySitesforPatient()
        {
            return this.iRegisterationService.GetBodySitesforPatient();
        }

        [HttpGet]
        public List<MedicationRoute> GetMedicationRouteforPatient()
        {
            return this.iRegisterationService.GetMedicationRouteforPatient();
        }

        [HttpGet]
        public List<DocumentType> GetDocumentTypeforPatient()
        {
            return this.iRegisterationService.GetDocumentTypeforPatient();
        }

        #endregion

        #region Patients

        [HttpGet]
        public List<PatientDemographicModel> GetAllPatients()
        {
            return this.iRegisterationService.GetAllPatients();
        }

        [HttpGet]
        public PatientDemographicModel GetPatientDetailById(int PatientId)
        {
            return this.iRegisterationService.GetPatientDetailById(PatientId);
        }

        [HttpPost]
        public PatientDemographicModel AddUpdatePatientData(PatientDemographicModel patData)
        {
            return this.iRegisterationService.AddUpdatePatientData(patData);
        }

        [HttpGet]
        public List<PatientDemographicModel> GetPatientsBySearch(string Searchkey)
        {
            return this.iRegisterationService.GetPatientsBySearch(Searchkey);
        }

        [HttpGet]
        public List<PatientVisitModel> GetVisitsForPatient(int PatientId)
        {
            return this.iRegisterationService.GetVisitsForPatient(PatientId);
        }

        #region Family Health History

        [HttpPost]
        public FamilyHealthHistoryModel AddUpdateFamilyHealthHistory(FamilyHealthHistoryModel familyHealthModel)
        {
            return this.iRegisterationService.AddUpdateFamilyHealthHistory(familyHealthModel);
        }

        [HttpGet]
        public FamilyHealthHistoryModel GetFamilyHealthRecordbyID(int familyHealthHistoryID)
        {
            return this.iRegisterationService.GetFamilyHealthRecordbyID(familyHealthHistoryID);
        }

        [HttpGet]
        public List<FamilyHealthHistoryModel> GetFamilyHealthHistory(int PatientId)
        {
            return this.iRegisterationService.GetFamilyHealthHistory(PatientId);
        }

        [HttpGet]
        public FamilyHealthHistory DeleteFamilyHealthRecord(int familyHealthHistoryID)
        {
            return this.iRegisterationService.DeleteFamilyHealthRecord(familyHealthHistoryID);
        }

        #endregion

        #region Hospitalization History

        [HttpPost]
        public HospitalizationHistoryModel AddUpdateHospitalizationHistory(HospitalizationHistoryModel hospitalizationModel)
        {
            return this.iRegisterationService.AddUpdateHospitalizationHistory(hospitalizationModel);
        }

        [HttpGet]
        public List<HospitalizationHistoryModel> GetHospitalizationHistory(int PatientId)
        {
            return this.iRegisterationService.GetHospitalizationHistory(PatientId);
        }

        [HttpGet]
        public HospitalizationHistoryModel GetHospitalizationRecordbyID(int hospitalizationID)
        {
            return this.iRegisterationService.GetHospitalizationRecordbyID(hospitalizationID);
        }

        [HttpGet]
        public HospitalizationHistory DeleteHospitalizationRecord(int hospitalizationID)
        {
            return this.iRegisterationService.DeleteHospitalizationRecord(hospitalizationID);
        }        

        #endregion

        #region Physical Exam
        [HttpPost]
        public PhysicalExamModel AddUpdatePhysicalExamData(PhysicalExamModel physicalModel)
        {
            return this.iRegisterationService.AddUpdatePhysicalExamData(physicalModel);
        }

        [HttpGet]
        public List<PhysicalExamModel> GetPhysicalExamList(int PatientId)
        {
            return this.iRegisterationService.GetPhysicalExamList(PatientId);
        }

        [HttpGet]
        public PhysicalExamModel GetPhysicalExamRecordbyID(int physicalExamID)
        {
            return this.iRegisterationService.GetPhysicalExamRecordbyID(physicalExamID);
        }

        [HttpGet]
        public PhysicalExam DeletePhysicalExamRecord(int physicalExamID)
        {
            return this.iRegisterationService.DeletePhysicalExamRecord(physicalExamID);
        }
        #endregion

        #region Patient Work History
        [HttpPost]
        public PatientWorkHistoryModel AddUpdatePatientWorkHistory(PatientWorkHistoryModel workHistoryModel)
        {
            return this.iRegisterationService.AddUpdatePatientWorkHistory(workHistoryModel);
        }

        [HttpGet]
        public List<PatientWorkHistoryModel> GetPatientWorkHistoryList(int PatientId)
        {
            return this.iRegisterationService.GetPatientWorkHistoryList(PatientId);
        }

        [HttpGet]
        public PatientWorkHistoryModel GetPatientWorkRecordbyID(int patientWorkHistoryID)
        {
            return this.iRegisterationService.GetPatientWorkRecordbyID(patientWorkHistoryID);
        }

        [HttpGet]
        public PatientWorkHistory DeletePatientWorkRecord(int patientWorkHistoryID)
        {
            return this.iRegisterationService.DeletePatientWorkRecord(patientWorkHistoryID);
        }
        #endregion

        #region Patient Immunization 
        [HttpPost]
        public PatientImmunizationModel AddUpdatePatientImmunizationData(PatientImmunizationModel immunizationModel)
        {
            return this.iRegisterationService.AddUpdatePatientImmunizationData(immunizationModel);
        }

        [HttpGet]
        public List<PatientImmunizationModel> GetPatientImmunizationList(int PatientId)
        {
            return this.iRegisterationService.GetPatientImmunizationList(PatientId);
        }

        [HttpGet]
        public PatientImmunizationModel GetPatientImmunizationRecordbyID(int immunizationID)
        {
            return this.iRegisterationService.GetPatientImmunizationRecordbyID(immunizationID);
        }

        [HttpGet]
        public PatientImmunization DeletePatientImmunizationRecord(int immunizationID)
        {
            return this.iRegisterationService.DeletePatientImmunizationRecord(immunizationID);
        }

        #endregion

        #region Document Management
        [HttpPost]
        public DocumentManagementModel AddUpdateDocumentData(DocumentManagementModel documentModel)
        {
            return this.iRegisterationService.AddUpdateDocumentData(documentModel);
        }

        [HttpGet]
        public List<DocumentManagementModel> GetDocumentManagementList(int PatientId)
        {
            return this.iRegisterationService.GetDocumentManagementList(PatientId);
        }

        [HttpGet]
        public DocumentManagementModel GetDocumentRecordbyID(int documentID)
        {
            return this.iRegisterationService.GetDocumentRecordbyID(documentID);
        }

        [HttpGet]
        public DocumentManagement DeleteDocumentRecord(int documentID)
        {
            return this.iRegisterationService.DeleteDocumentRecord(documentID);
        }
        #endregion

        #region Patient Insurance
        [HttpPost]
        public PatientInsuranceModel AddUpdatePatientInsuranceData(PatientInsuranceModel insuranceModel)
        {
            return this.iRegisterationService.AddUpdatePatientInsuranceData(insuranceModel);
        }

        [HttpGet]
        public List<PatientInsuranceModel> GetPatientInsuranceList(int PatientId)
        {
            return this.iRegisterationService.GetPatientInsuranceList(PatientId);
        }

        [HttpGet]
        public PatientInsuranceModel GetPatientInsuranceRecordbyID(int insuranceID)
        {
            return this.iRegisterationService.GetPatientInsuranceRecordbyID(insuranceID);
        }

        [HttpGet]
        public PatientInsurance DeleteInsuranceRecord(int insuranceID)
        {
            return this.iRegisterationService.DeleteInsuranceRecord(insuranceID);
        }
        #endregion

        #region Radiology Order

        [HttpPost]
        public RadiologyOrderModel AddUpdateRadiologyRecord(RadiologyOrderModel radiologyOrderModel)
        {
            return this.iRegisterationService.AddUpdateRadiologyRecord(radiologyOrderModel);
        }

        [HttpGet]
        public List<RadiologyOrderModel> GetRadiologyRecordsforPatient(int PatientId)
        {
            return this.iRegisterationService.GetRadiologyRecordsforPatient(PatientId);
        }

        [HttpGet]
        public RadiologyOrderModel GetRadiologyRecordbyID(int radiologyID)
        {
            return this.iRegisterationService.GetRadiologyRecordbyID(radiologyID);
        }

        [HttpGet]
        public RadiologyOrder DeleteRadiologyRecord(int radiologyID)
        {
            return this.iRegisterationService.DeleteRadiologyRecord(radiologyID);
        }
        #endregion

        #region Vitals-Patient Screen

        [HttpGet]
        public List<PatientVitalsModel> GetVitalsForPatient(int PatientId)
        {
            return this.iRegisterationService.GetVitalsForPatient(PatientId);
        }

        [HttpGet]
        public PatientVitalsModel GetVitalRecordbyID(int VitalsId)
        {
            return this.iRegisterationService.GetVitalRecordbyID(VitalsId);
        }

        [HttpGet]
        public PatientVitals DeleteVitalRecord(int VitalsId)
        {
            return this.iRegisterationService.DeleteVitalRecord(VitalsId);
        }

        #endregion

        #region Allergy-Patient Screen

        [HttpGet]
        public List<PatientAllergyModel> GetAllergiesforPatient(int PatientId)
        {
            return this.iRegisterationService.GetAllergiesforPatient(PatientId);
        }

        [HttpGet]
        public PatientAllergyModel GetAllergyRecordbyID(int AllergyId)
        {
            return this.iRegisterationService.GetAllergyRecordbyID(AllergyId);
        }

        [HttpGet]
        public PatientAllergy DeleteAllergyRecord(int AllergyId)
        {
            return this.iRegisterationService.DeleteAllergyRecord(AllergyId);
        }

        #endregion

        #region ProblemList-Patient Screen

        [HttpGet]
        public List<PatientProblemListModel> GetPatientProblemListforPatient(int PatientId)
        {
            return this.iRegisterationService.GetPatientProblemListforPatient(PatientId);
        }

        [HttpGet]
        public PatientProblemListModel GetPatientProblemRecordbyID(int problemListId)
        {
            return this.iRegisterationService.GetPatientProblemRecordbyID(problemListId);
        }

        [HttpGet]
        public PatientProblemList DeletePatientProblemRecord(int problemListId)
        {
            return this.iRegisterationService.DeletePatientProblemRecord(problemListId);
        }

        #endregion

        #region Medication History-Patient Screen

        [HttpGet]
        public List<PatientMedicationHistoryModel> GetPatientMedicationHistoryListForPatient(int PatientId)
        {
            return this.iRegisterationService.GetPatientMedicationHistoryListForPatient(PatientId);
        }

        [HttpGet]
        public PatientMedicationHistoryModel GetPatientMedicationHistoryRecordbyID(int PatientMedicationId)
        {
            return this.iRegisterationService.GetPatientMedicationHistoryRecordbyID(PatientMedicationId);
        }

        [HttpGet]
        public PatientMedicationHistory DeletePatientMedicationRecord(int PatientMedicationId)
        {
            return this.iRegisterationService.DeletePatientMedicationRecord(PatientMedicationId);
        }

        #endregion

        #region Social History-Patient Screen

        [HttpGet]
        public List<PatientSocialHistoryModel> GetSocialHistoryListforPatient(int PatientId)
        {
            return this.iRegisterationService.GetSocialHistoryListforPatient(PatientId);
        }

        [HttpGet]
        public PatientSocialHistoryModel GetSocialHistoryRecordbyID(int SocialHistoryID)
        {
            return this.iRegisterationService.GetSocialHistoryRecordbyID(SocialHistoryID);
        }

        [HttpGet]
        public PatientSocialHistory DeletePatientSocialHistoryRecord(int SocialHistoryID)
        {
            return this.iRegisterationService.DeletePatientSocialHistoryRecord(SocialHistoryID);
        }

        #endregion

        #region ROS-Patient Screen

        [HttpGet]
        public List<ROSModel> GetROSDetailsforPatient(int PatientId)
        {
            return this.iRegisterationService.GetROSDetailsforPatient(PatientId);
        }

        [HttpGet]
        public ROSModel GetROSRecordbyID(int ROSId)
        {
            return this.iRegisterationService.GetROSRecordbyID(ROSId);
        }

        [HttpGet]
        public ROS DeleteROSRecord(int ROSId)
        {
            return this.iRegisterationService.DeleteROSRecord(ROSId);
        }

        #endregion

        #region Nutrition-Patient Screen

        [HttpGet]
        public List<NutritionAssessmentModel> GetNutritionAssessmentListforPatient(int PatientId)
        {
            return this.iRegisterationService.GetNutritionAssessmentListforPatient(PatientId);
        }

        [HttpGet]
        public NutritionAssessmentModel GetNutritionAssessmentRecordbyID(int nutritionAssessmentId)
        {
            return this.iRegisterationService.GetNutritionAssessmentRecordbyID(nutritionAssessmentId);
        }

        [HttpGet]
        public NutritionAssessment DeleteNutritionRecord(int nutritionAssessmentId)
        {
            return this.iRegisterationService.DeleteNutritionRecord(nutritionAssessmentId);
        }

        #endregion

        #region Cognitive-Patient Screen

        [HttpGet]
        public List<CognitiveModel> GetCognitiveListforPatient(int PatientId)
        {
            return this.iRegisterationService.GetCognitiveListforPatient(PatientId);
        }

        [HttpGet]
        public CognitiveModel GetCognitiveRecordbyID(int cognitiveId)
        {
            return this.iRegisterationService.GetCognitiveRecordbyID(cognitiveId);
        }

        [HttpGet]
        public Cognitive DeleteCognitiveRecord(int cognitiveId)
        {
            return this.iRegisterationService.DeleteCognitiveRecord(cognitiveId);
        }

        #endregion

        #region Nursing SignOff-Patient Screen

        [HttpGet]
        public List<NursingSignOffModel> GetNursingSignedoffListforPatient(int PatientId)
        {
            return this.iRegisterationService.GetNursingSignedoffListforPatient(PatientId);
        }

        [HttpGet]
        public NursingSignOffModel GetNursingSignedoffRecordbyID(int nursingId)
        {
            return this.iRegisterationService.GetNursingSignedoffRecordbyID(nursingId);
        }

        [HttpGet]
        public NursingSignOff DeleteNursingSignOffRecord(int nursingId)
        {
            return this.iRegisterationService.DeleteNursingSignOffRecord(nursingId);
        }

        #endregion

        #region Diagnosis-Patient Screen

        [HttpGet]
        public List<DiagnosisModel> GetDiagnosisforPatient(int PatientId)
        {
            return this.iRegisterationService.GetDiagnosisforPatient(PatientId);
        }

        [HttpGet]
        public DiagnosisModel GetDiagnosisRecordbyID(int diagnosisID)
        {
            return this.iRegisterationService.GetDiagnosisRecordbyID(diagnosisID);
        }

        [HttpGet]
        public Diagnosis DeleteDiagnosisRecord(int diagnosisID)
        {
            return this.iRegisterationService.DeleteDiagnosisRecord(diagnosisID);
        }

        #endregion

        #region CaseSheet Procedure-Patient Screen

        [HttpGet]
        public List<CaseSheetProcedureModel> GetProceduresforPatient(int PatientId)
        {
            return this.iRegisterationService.GetProceduresforPatient(PatientId);
        }

        [HttpGet]
        public CaseSheetProcedureModel GetProcedureRecordbyID(int procedureID)
        {
            return this.iRegisterationService.GetProcedureRecordbyID(procedureID);
        }

        [HttpGet]
        public CaseSheetProcedure DeleteProcedureRecord(int procedureID)
        {
            return this.iRegisterationService.DeleteProcedureRecord(procedureID);
        }

        #endregion

        #region Care Plan - Patient Screen

        [HttpGet]
        public List<CarePlanModel> GetCarePlansforPatient(int PatientId)
        {
            return this.iRegisterationService.GetCarePlansforPatient(PatientId);
        }

        [HttpGet]
        public CarePlanModel GetCarePlanRecordbyID(int carePlanID)
        {
            return this.iRegisterationService.GetCarePlanRecordbyID(carePlanID);
        }

        [HttpGet]
        public CarePlan DeleteCarePlanRecord(int carePlanID)
        {
            return this.iRegisterationService.DeleteCarePlanRecord(carePlanID);
        }

        #endregion

        #region Patient Admissions
        [HttpGet]
        public List<AdmissionsModel> GetPatientAdmissions(int PatientId)
        {
            return this.iRegisterationService.GetPatientAdmissions(PatientId);
        }

        [HttpGet]
        public AdmissionsModel GetAdmissionRecordByID(int admissionID)
        {
            return this.iRegisterationService.GetAdmissionRecordByID(admissionID);
        }

        [HttpGet]
        public Admissions DeleteAdmissionRecordbyID(int admissionID)
        {
            return this.iRegisterationService.DeleteAdmissionRecordbyID(admissionID);
        }

        #endregion

        #region Audiology - Patient Screen

        [HttpGet]
        public List<AudiologyRequestModel> GetAudiologyRequestsbyPatientId(int patientId)
        {
            return this.iRegisterationService.GetAudiologyRequestsbyPatientId(patientId);
        }

        [HttpGet]
        public AudiologyDataModel GetAudiologyRecords(int patientId)
        {
            return this.iRegisterationService.GetAudiologyRecords(patientId);
        }

        [HttpGet]
        public AudiologyDataModel GetAudiologyRecordsbyVisit(int visitId)
        {
            return this.iRegisterationService.GetAudiologyRecordsbyVisit(visitId);
        }

        #endregion

        #region e Lab Order - Patient Screen

        [HttpGet]
        public List<eLabOrderModel> GetELabOrdersbyPatient(int patientId)
        {
            return this.iRegisterationService.GetELabOrdersbyPatient(patientId);
        }

        [HttpGet]
        public eLabOrderModel GetELabOrderbyOrderNo(string orderNo)
        {
            return this.iRegisterationService.GetELabOrderbyOrderNo(orderNo);
        }

        [HttpGet]
        public List<eLabOrder> CancelLabOrdersfromPatient(string orderNo)
        {
            return this.iRegisterationService.CancelLabOrdersfromPatient(orderNo);
        }

        #endregion

        #region e Prescription (Medication) - Patient Screen

        [HttpGet]
        public List<MedicationsModel> GetMedicationsbyPatient(int patientId)
        {
            return this.iRegisterationService.GetMedicationsbyPatient(patientId);
        }

        [HttpGet]
        public MedicationsModel GetMedicationRecordbyIDfromPatient(int medicationId)
        {
            return this.iRegisterationService.GetMedicationRecordbyIDfromPatient(medicationId);
        }

        [HttpGet]
        public Medications CancelMedicationFromPatient(int medicationId)
        {
            return this.iRegisterationService.CancelMedicationFromPatient(medicationId);
        }

        #endregion

        #region Discharge Summary - Patient Screen

        [HttpGet]
        public List<DischargeSummaryModel> GetDischargeRecordsforPatient(int patientId)
        {
            return this.iRegisterationService.GetDischargeRecordsforPatient(patientId);
        }

        [HttpGet]
        public DischargeSummaryModel GetDischargeSummaryRecordbyID(int dischargeSummaryId)
        {
            return this.iRegisterationService.GetDischargeSummaryRecordbyID(dischargeSummaryId);
        }

        #endregion

        #endregion

        #region Facility
        [HttpGet]
        public List<Facility> GetAllFacilities()
        {
            return this.iRegisterationService.GetAllFacilities();
        }

        [HttpPost]
        public FacilityModel AddUpdateFacility(FacilityModel facData)
        {
            return this.iRegisterationService.AddUpdateFacility(facData);
        }
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

                    if (screen.ToLower().Trim() == "patient")
                    {
                        var files = this.GetFile(Id, screen);
                        if (files.Count() > 0)
                        {
                            foreach (var set in files)
                            {
                                var splitPath = set.FileUrl.Split("/" + set.FileName)[0];
                                var message = this.iTenantMasterService.DeleteFile(splitPath, set.FileName);
                            }
                        }
                    }

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
        public List<clsViewFile> GetFile(int Id, string screen)
        {
            return this.iRegisterationService.GetFile(Id.ToString(), screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iRegisterationService.DeleteFile(path, fileName);
        }
        #endregion

        [HttpGet]
        public List<ProviderModel> GetProviders()
        {
            return this.iRegisterationService.GetProviders();
        }

        [HttpPost]
        public string SendMessage(string message)
        {
            //we creating the necessary URL string:
            string status = "";
            string uRL = "https://api.textlocal.in/send/?"; //where the SMS Gateway is running
            //string uRL = "https://control.textlocal.in/send/?"; //where the SMS Gateway is running
            string senderid = HttpUtility.UrlEncode("SHROFF");  // here assigning sender id 

            string username = HttpUtility.UrlEncode("dinesh@bmsmartware.com"); // API user name to send SMS
            string password = HttpUtility.UrlEncode("Bms$2020");     // API password to send SMS
            string recipient = HttpUtility.UrlEncode("9150537899");  // who will receive message
            string messageText = HttpUtility.UrlEncode(message); // text message

            // Creating URL to send sms
            string _createURL = uRL +
            "username=" + username +
               "&password=" + password +
               "&senderid=" + senderid +
               "&dest_mobileno=" +("91" + recipient) +
               "&message=" + messageText;

            try
            {
                // creating web request to send sms 
                HttpWebRequest _createRequest = (HttpWebRequest)WebRequest.Create(_createURL);
                // getting response of sms
                HttpWebResponse myResp = (HttpWebResponse)_createRequest.GetResponse();
                StreamReader _responseStreamReader = new StreamReader(myResp.GetResponseStream());
                string responseString = _responseStreamReader.ReadToEnd();
                _responseStreamReader.Close();
                myResp.Close();
                status = responseString;
            }
            catch (Exception ex)
            {
                status = ex.Message;
            }

            return status;
        }

        //[HttpGet]
        //public async Task<JObject> SendOtp(string number)
        //{
        //    using (var client = _httpClientFactory.CreateClient())
        //    {
        //        client.BaseAddress = new Uri("https://api.textlocal.in/");
        //        client.DefaultRequestHeaders.Add("accept", "application/json");
        //        var query = HttpUtility.ParseQueryString(string.Empty);
        //        query["apikey"] = ".....";
        //        query["numbers"] = ".....";
        //        query["message"] = ".....";
        //        var response = await client.GetAsync("send?" + query);
        //        response.EnsureSuccessStatusCode();
        //        var content = await response.Content.ReadAsStringAsync();
        //        return JObject.Parse(content);
        //    }
        //}

        //[HttpGet]
        [HttpPost]
        public string sendSMS()
        {
            var text = this.iRegisterationService.sendSMS();

            if(text.ToLower().Trim().Contains("fail"))
            {
                return "failed";
            }
            else
            {
                return "success";
            }
        }

    }
}