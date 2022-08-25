using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IRegisterationService
    {
        #region Master Data

        List<Gender> GetGendersForPatient();
        List<Salutation> GetSalutationsforPatient();
        List<State> GetStateListforPatient();
        List<Country> GetCountryListforPatient();
        List<TreatmentCode> GetCPTCodesbySearch(string searchkey);
        List<DiagnosisCode> GetICDCodesbySearch(string searchkey);
        List<DischargeCode> GetDischargeCodesbySearch(string searchkey);
        List<string> GetProviderNames(int facilityId);
        List<ProviderModel> GetProvidersforRegisteration(string searchKey);
        List<Relationshiptopatient> GetAllRelations();
        List<IdentificationIdType> GetIdentificationTypes();
        List<PatientCategory> GetAllPatientCategories();
        List<PatientType> GetAllPatientTypes();
        List<FamilyHistoryStatusMaster> GetAllFamilyHistoryStatusMasters();
        List<MaritalStatus> GetMaritalStatusesForPatient();
        List<ContactType> GetContactTypesForPatient();
        List<Religion> GetReligionsForPatient();
        List<Race> GetRacesForPatient();
        List<BloodGroup> GetBloodGroupsforPatient();
        List<IllnessType> GetIllnessTypesforPatient();
        List<AdmissionType> GetAdmissionTypesforRegisteration();
        List<AdmissionStatus> GetAdmissionStatusforRegisteration();
        List<ProblemStatus> GetProblemStatusesforRegisteration();
        List<ProcedureType> GetProcedureTypesforRegisteration();
        List<InsuranceType> GetInsuranceTypesforPatient();
        List<InsuranceCategory> GetInsuranceCategoriesforPatient();
        List<RadiologyProcedureRequested> GetRadiologyProcedureRequestedforPatient();
        List<RadiologyType> GetRadiologyTypesforPatient();
        List<ReferredLab> GetReferredLabsforPatient();
        List<BodySection> GetBodySectionsforPatient();
        List<ReportFormat> GetReportFormatsforPatient();
        List<BodySite> GetBodySitesforPatient();
        List<MedicationRoute> GetMedicationRouteforPatient();
        List<DocumentType> GetDocumentTypeforPatient();

        #endregion

        #region Patients
        List<PatientDemographicModel> GetAllPatients();
        PatientDemographicModel GetPatientDetailById(int PatientId);
        PatientDemographicModel AddUpdatePatientData(PatientDemographicModel patData);
        List<PatientDemographicModel> GetPatientsBySearch(string Searchkey);
        List<PatientVisitModel> GetVisitsForPatient(int PatientId);

        #region Family Health History
        FamilyHealthHistoryModel AddUpdateFamilyHealthHistory(FamilyHealthHistoryModel familyHealthModel);
        FamilyHealthHistoryModel GetFamilyHealthRecordbyID(int familyHealthHistoryID);
        List<FamilyHealthHistoryModel> GetFamilyHealthHistory(int PatientId);
        FamilyHealthHistory DeleteFamilyHealthRecord(int familyHealthHistoyID);
        #endregion

        #region Hospitalization History
        HospitalizationHistoryModel AddUpdateHospitalizationHistory(HospitalizationHistoryModel hospitalizationModel);
        List<HospitalizationHistoryModel> GetHospitalizationHistory(int PatientId);
        HospitalizationHistoryModel GetHospitalizationRecordbyID(int hospitalizationID);
        HospitalizationHistory DeleteHospitalizationRecord(int hospitalizationID);
        #endregion

        #region Physical Exam
        PhysicalExamModel AddUpdatePhysicalExamData(PhysicalExamModel physicalModel);
        List<PhysicalExamModel> GetPhysicalExamList(int PatientId);
        PhysicalExamModel GetPhysicalExamRecordbyID(int physicalExamID);
        PhysicalExam DeletePhysicalExamRecord(int physicalExamID);
        #endregion

        #region Patient Work History
        PatientWorkHistoryModel AddUpdatePatientWorkHistory(PatientWorkHistoryModel workHistoryModel);
        List<PatientWorkHistoryModel> GetPatientWorkHistoryList(int PatientId);
        PatientWorkHistoryModel GetPatientWorkRecordbyID(int patientWorkHistoryID);
        PatientWorkHistory DeletePatientWorkRecord(int patientWorkHistoryID);
        #endregion

        #region Patient Immunization
        PatientImmunizationModel AddUpdatePatientImmunizationData(PatientImmunizationModel immunizationModel);
        List<PatientImmunizationModel> GetPatientImmunizationList(int PatientId);
        PatientImmunizationModel GetPatientImmunizationRecordbyID(int immunizationID);
        PatientImmunization DeletePatientImmunizationRecord(int immunizationID);
        #endregion

        #region Document Management
        DocumentManagementModel AddUpdateDocumentData(DocumentManagementModel documentModel);
        List<DocumentManagementModel> GetDocumentManagementList(int PatientId);
        DocumentManagementModel GetDocumentRecordbyID(int documentID);
        DocumentManagement DeleteDocumentRecord(int documentID);
        #endregion

        #region Patient Insurance
        PatientInsuranceModel AddUpdatePatientInsuranceData(PatientInsuranceModel insuranceModel);
        List<PatientInsuranceModel> GetPatientInsuranceList(int PatientId);
        PatientInsuranceModel GetPatientInsuranceRecordbyID(int insuranceID);
        PatientInsurance DeleteInsuranceRecord(int insuranceID);
        #endregion

        #region Radiology Order
        RadiologyOrderModel AddUpdateRadiologyRecord(RadiologyOrderModel radiologyOrderModel);
        List<RadiologyOrderModel> GetRadiologyRecordsforPatient(int PatientId);
        RadiologyOrderModel GetRadiologyRecordbyID(int radiologyID);
        RadiologyOrder DeleteRadiologyRecord(int radiologyID);
        #endregion

        #region Vitals-Patient Screen
        List<PatientVitalsModel> GetVitalsForPatient(int PatientId);
        PatientVitalsModel GetVitalRecordbyID(int VitalsId);
        PatientVitals DeleteVitalRecord(int VitalsId);

        #endregion

        #region Allergy-Patient Screen
        List<PatientAllergyModel> GetAllergiesforPatient(int PatientId);
        PatientAllergyModel GetAllergyRecordbyID(int AllergyId);
        PatientAllergy DeleteAllergyRecord(int AllergyId);

        #endregion

        #region ProblemList-Patient Screen
        List<PatientProblemListModel> GetPatientProblemListforPatient(int PatientId);
        PatientProblemListModel GetPatientProblemRecordbyID(int problemListId);
        PatientProblemList DeletePatientProblemRecord(int problemListId);

        #endregion

        #region Medication History-Patient Screen
        List<PatientMedicationHistoryModel> GetPatientMedicationHistoryListForPatient(int PatientId);
        PatientMedicationHistoryModel GetPatientMedicationHistoryRecordbyID(int PatientMedicationId);
        PatientMedicationHistory DeletePatientMedicationRecord(int PatientMedicationId);

        #endregion

        #region Social History-Patient Screen
        List<PatientSocialHistoryModel> GetSocialHistoryListforPatient(int PatientId);
        PatientSocialHistoryModel GetSocialHistoryRecordbyID(int SocialHistoryID);
        PatientSocialHistory DeletePatientSocialHistoryRecord(int SocialHistoryID);

        #endregion

        #region ROS-Patient Screen
        List<ROSModel> GetROSDetailsforPatient(int PatientId);
        ROSModel GetROSRecordbyID(int ROSId);
        ROS DeleteROSRecord(int ROSId);

        #endregion

        #region Nutrition-Patient Screen
        List<NutritionAssessmentModel> GetNutritionAssessmentListforPatient(int PatientId);
        NutritionAssessmentModel GetNutritionAssessmentRecordbyID(int nutritionAssessmentId);
        NutritionAssessment DeleteNutritionRecord(int nutritionAssessmentId);

        #endregion

        #region Cognitive-Patient Screen
        List<CognitiveModel> GetCognitiveListforPatient(int PatientId);
        CognitiveModel GetCognitiveRecordbyID(int cognitiveId);
        Cognitive DeleteCognitiveRecord(int cognitiveId);

        #endregion

        #region Nursing SignOff-Patient Screen
        List<NursingSignOffModel> GetNursingSignedoffListforPatient(int PatientId);
        NursingSignOffModel GetNursingSignedoffRecordbyID(int nursingId);
        NursingSignOff DeleteNursingSignOffRecord(int nursingId);

        #endregion

        #region Diagnosis-Patient Screen
        List<DiagnosisModel> GetDiagnosisforPatient(int PatientId);
        DiagnosisModel GetDiagnosisRecordbyID(int diagnosisID);
        Diagnosis DeleteDiagnosisRecord(int diagnosisID);

        #endregion

        #region CaseSheet Procedure-Patient Screen
        List<CaseSheetProcedureModel> GetProceduresforPatient(int PatientId);
        CaseSheetProcedureModel GetProcedureRecordbyID(int procedureID);
        CaseSheetProcedure DeleteProcedureRecord(int procedureID);

        #endregion

        #region Care Plan - Patient Screen

        List<CarePlanModel> GetCarePlansforPatient(int PatientId);
        CarePlanModel GetCarePlanRecordbyID(int carePlanID);
        CarePlan DeleteCarePlanRecord(int carePlanID);

        #endregion

        #region Patient Admissions
        List<AdmissionsModel> GetPatientAdmissions(int PatientId);
        AdmissionsModel GetAdmissionRecordByID(int admissionID);
        Admissions DeleteAdmissionRecordbyID(int admissionID);
        #endregion

        #region Audiology - Patient Screen

        List<AudiologyRequestModel> GetAudiologyRequestsbyPatientId(int patientId);
        AudiologyDataModel GetAudiologyRecords(int patientId);
        AudiologyDataModel GetAudiologyRecordsbyVisit(int visitId);

        #endregion

        #region e Lab Order - Patient Screen

        List<eLabOrderModel> GetELabOrdersbyPatient(int patientId);
        eLabOrderModel GetELabOrderbyOrderNo(string orderNo);
        List<eLabOrder> CancelLabOrdersfromPatient(string orderNo);

        #endregion

        #region e Prescription (Medication) - Patient Screen

        List<MedicationsModel> GetMedicationsbyPatient(int patientId);
        MedicationsModel GetMedicationRecordbyIDfromPatient(int medicationId);
        Medications CancelMedicationFromPatient(int medicationId);

        #endregion

        #region Discharge Summary - Patient Screen

        List<DischargeSummaryModel> GetDischargeRecordsforPatient(int patientId);
        DischargeSummaryModel GetDischargeSummaryRecordbyID(int dischargeSummaryId);

        #endregion

        #endregion

        #region Facility
        List<Facility> GetAllFacilities();
        FacilityModel AddUpdateFacility(FacilityModel facData);
        #endregion                

        List<ProviderModel> GetProviders();

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);
        #endregion

        #region Mail and SMS

        string sendSMS();

        #endregion

    }
}
