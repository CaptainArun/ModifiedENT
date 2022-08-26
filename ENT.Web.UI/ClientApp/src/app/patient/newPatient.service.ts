import { Injectable } from "@angular/core";
import { NewPatientRegModel } from './models/newPatientRegModel';
import { CustomHttpService } from '../core/custom-http.service';
import { patientInsurancemodel } from './models/patientInsuranceModel';
import { hospitalizationHistoryModel } from './models/hospitalizationHistoryModel';
import { PatientFamilyHistoryModel } from './models/PatientFamilyHistoryModel';
import { PatientWorkHistoryModel } from './models/PatientWorkHistoryModel';
import { documentManagementModel } from './models/documentManagementModel';
import { radiologyModel } from './models/RadiologyModel';
import { PatientSocialHistoryModel } from '../triage/models/patientSocialHistoryModel';
import { NutritionAssessmentModel } from '../triage/models/nutritionAssessmentModel';
import { PatientAllergyModel } from '../triage/models/PatientAllergyModel';
import { PatientProblemListModel } from '../triage/models/patientProblemListModel';
import { PatientMedicationHistoryModel } from '../triage/models/patientMedicationHistoryModel';
import { PatientVisitModel } from '../visit/models/patientVisitModel';
import { admission01Model } from '../admission/Models/admission01Model';
import { PatientInsuranceComponent } from './patient-insurance/patient-insurance.component';
import { immunizationModel } from './models/immunizationModel';


@Injectable({
  providedIn: 'root'
})

export class NewPatientService {

  patientId: any;

  constructor(private http: CustomHttpService) { }

  getIdentificationType(): Promise<any> {
    return this.http.get('/Registeration/GetIdentificationTypes').then(res => res);
  }

  getAllRelationship(): Promise<any> {
    return this.http.get('/Registeration/GetAllRelations').then(res => res);
  }
  
  getAllPatientData1(): Promise<any> {
    return this.http.get('/Registeration/GetAllPatients').then(res => res);
  }

  getAllPatientData(searchkey: string): Promise<any> {
    return this.http.get('/Registeration/GetPatientsBySearch?Searchkey=' + searchkey).then(res => res);
  }

  getPatientDetailsById(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientDetailById?PatientId=' + patientId).then(res => res);
  }

  addUpdatePatientDetail(patientRegModel: NewPatientRegModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePatientData', patientRegModel);
  }


  GetICDCodesbySearch(searchkey: string): Promise<any> {
    return this.http.get('/Registeration/GetICDCodesbySearch?searchKey=' + searchkey).then(res => res);
  }

  //GetCPTCodesbySearch(searchkey: string): Promise<any> {
  //  return this.http.get('/Registeration/GetCPTCodesbySearch?searchKey=' + searchkey).then(res => res);
  //}


  //GetProviderNames(patientId: number): Promise<any> {
  //  return this.http.get('/Registeration/GetProviderNames?facilityId =' + patientId).then(res => res);
  //}

  //getPatientExam(PatientId): Promise<any> {
  //  return this.http.get('/Registeration/GetVisitsForPatient?PatientId=' + PatientId).then(res => res);  
  //}
  //GetFamilyHealthHistory

  addUpdateFamilyHealthHistory(patientFamilyHistory: PatientFamilyHistoryModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdateFamilyHealthHistory', patientFamilyHistory);
  }

  getFamilyHealthHistory(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetFamilyHealthHistory?PatientId=' + PatientId).then(res => res);
  }

  getFamilyHealthHistorybyID(familyHealthHistoryId: number): Promise<any> {
    return this.http.get('/Registeration/GetFamilyHealthRecordbyID?familyHealthHistoryID=' + familyHealthHistoryId).then(res => res);
  }

  deletePatientFamilyHistory(familyHealthHistoryId: number) {
    return this.http.get('/Registeration/DeleteFamilyHealthRecord?familyHealthHistoryID=' + familyHealthHistoryId).then(res => res);
  }

  //PatientDemographic

  getPatientDemographic(PatientId: number): Promise<any> {    
    return this.http.get('/Registeration/GetPatientDetailById?PatientId=' + PatientId).then(res => res);
  }

  //PatientWorkHistory
  getPatientWorkHistorybyID(patientWorkHistoryID: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientWorkRecordbyID?patientWorkHistoryID=' + patientWorkHistoryID).then(res => res);
  }

  addUpdateWorkHistory(patientWorkHistory: PatientWorkHistoryModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePatientWorkHistory', patientWorkHistory);
  }

  getPatientWorkHistory(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientWorkHistoryList?PatientId=' + PatientId).then(res => res);
  }

  deleteWorkHistory(patientWorkHistoryID: number): Promise<any> {
    return this.http.get('/Registeration/DeletePatientWorkRecord?patientWorkHistoryID=' + patientWorkHistoryID);
  }

  //DocumentManagement
  getDocumentManagementList(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetDocumentManagementList?PatientId=' + patientId).then(res => res);
  }

  addUpdateDocumentManagement(DocumentManagementModel: documentManagementModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdateDocumentData', DocumentManagementModel);
  }

  getDocumentManagementbyId(DocumentId: number): Promise<any> {
    return this.http.get('/Registeration/GetDocumentRecordbyID?documentID=' + DocumentId).then(res => res);
  }



  deleteDocumentRecord(DocumentId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteDocumentRecord?documentID=' + DocumentId);
  }
  // RadiologyOrder
  addRadiologyRecord(RadiologyModel: radiologyModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdateRadiologyRecord', RadiologyModel);
  }

  getRadiologyRecord(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetRadiologyRecordsforPatient?PatientId=' + patientId).then(res => res);
  }

  getRadiologyRecordbyId(RadiologyId: number): Promise<any> {
    return this.http.get('/Registeration/GetRadiologyRecordbyID?radiologyID=' + RadiologyId).then(res => res);
  }

  deleteRadiologyRec(radiologyID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteRadiologyRecord?radiologyID=' + radiologyID);
  }

  //SocialHistory
  getSocialHistorylist(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetSocialHistoryListforPatient?PatientId=' + patientId).then(res => res);
  }

  addUpdateSocialHistory(socialHistoryModel: PatientSocialHistoryModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdateSocialHistoryForVisit', socialHistoryModel);
  }

  getSocialHistorybyId(SocialHistoryID: number): Promise<any> {
    return this.http.get('/Registeration/GetSocialHistoryRecordbyID?SocialHistoryID=' + SocialHistoryID).then(res => res);
  }

  deleteSocialHistory(SocialHistoryID: number): Promise<any> {
    return this.http.get('/Registeration/DeletePatientSocialHistoryRecord?SocialHistoryID=' + SocialHistoryID).then(res => res);
  }

  GetCPTCodesbySearch(searchkey: string): Promise<any> {
    return this.http.get('/Registeration/GetCPTCodesbySearch?searchKey=' + searchkey).then(res => res);
  }

  GetDischargeCodesbySearch(searchkey: string): Promise<any> {
    return this.http.get('/Registeration/GetDischargeCodesbySearch?searchKey=' + searchkey).then(res => res);
  }

  GetVisitsForPatient(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVisitsForPatient?PatientId=' + patientId).then(res => res);
  }

  getPatientExam(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVisitsForPatient?PatientId' + PatientId).then(res => res);
  }

  AddUpdateHospitalizationHistory(hospitalHistory: hospitalizationHistoryModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdateHospitalizationHistory', hospitalHistory);
  }

  GetHospitalizationHistory(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetHospitalizationHistory?PatientId=' + patientId).then(res => res);
  }

  GetHospitalizationRecordbyID(hospitalizationID: number): Promise<any> {
    return this.http.get('/Registeration/GetHospitalizationRecordbyID?hospitalizationID=' + hospitalizationID).then(res => res);
  }

  GetPatientInsuranceList(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientInsuranceList?PatientId=' + patientId).then(res => res);
  }

  AddUpdatePatientInsuranceData(insurance: patientInsurancemodel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePatientInsuranceData', insurance);
  }

  DeleteHospitalizationRecord(patientId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteHospitalizationRecord?HospitalizationID=' + patientId);
  }

  GetProviderNames(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetProviderNames?facilityId =' + patientId).then(res => res);
  }
  getfamilyhistory(): Promise<any> {
    return this.http.get('/Registeration/GetAllFamilyHistoryStatusMasters').then(res => res);
  }

  GetPatientInsuranceRecordbyID(insuranceID: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientInsuranceRecordbyID?insuranceID=' + insuranceID).then(res => res);
  }

  DeleteInsuranceRecord(insuranceID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteInsuranceRecord?insuranceID=' + insuranceID);
  }

  //patientROS
  getROSdetailsforPatient(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetROSDetailsforPatient?PatientId=' + patientId).then(res => res);
  }

  getROSdetailsbyId(ROSID: number): Promise<any> {
    return this.http.get('/Registeration/GetROSRecordbyID?ROSId=' + ROSID).then(res => res);
  }

  DeleteROSDetails(ROSID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteROSRecord?ROSId=' + ROSID).then(res => res);
  }
  //Nutrition
  addUpdateNutrition(nutritionModel: NutritionAssessmentModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateNutritionForVisit', nutritionModel).then(res => res);
  }

  getNutritionRecord(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetNutritionAssessmentListforPatient?PatientId=' + patientId).then(res => res);
  }
  getNutritionRecordbyId(nutritionAssessmentId: number): Promise<any> {
    return this.http.get('/Registeration/GetNutritionAssessmentRecordbyID?nutritionAssessmentId=' + nutritionAssessmentId).then(res => res);
  }
  deleteNutritionRec(nutritionAssessmentId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteNutritionRecord?nutritionAssessmentId=' + nutritionAssessmentId).then(res => res);
  }
  //Vitals
  getvitalsforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVitalsForPatient?PatientId=' + PatientId).then(res => res);
  }

  getVitalsForPatientbyId(VitalsId: number): Promise<any> {
    return this.http.get('/Registeration/GetVitalRecordbyID?VitalsId=' + VitalsId).then(res => res);
  }

  deleteVitalsforPatient(VitalsId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteVitalRecord?VitalsId=' + VitalsId).then(res => res);
  }
  //Function&Cognitive
  getCognitiveListforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetCognitiveListforPatient?PatientId=' + PatientId).then(res => res);
  }

  getCognitiveRecbyID(cognitiveId: number): Promise<any> {
    return this.http.get('/Registeration/GetCognitiveRecordbyID?cognitiveId=' + cognitiveId).then(res => res);
  }

  deleteCognitiveRec(cognitiveId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteCognitiveRecord?cognitiveId=' + cognitiveId).then(res => res);
  }
  // New Patinet allargies

  GetAllergiesforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetAllergiesforPatient?PatientId=' + PatientId);
  }

  AddUpdateAllergiesForVisit(allergiesModel: PatientAllergyModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateAllergiesForVisit', allergiesModel)
  }

  GetAllergyRecordbyID(AllergyId: number): Promise<any> {
    return this.http.get('/Registeration/GetAllergyRecordbyID?AllergyId=' + AllergyId);
  }

  DeleteAllergyRecord(AllergyId: number): Promise<any> {
    return this.http.get('/Registeration/DeleteAllergyRecord?AllergyId=' + AllergyId);
  }

  // Problem List

  GetPatientProblemListforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientProblemListforPatient?PatientId=' + PatientId);
  }

  AddUpdateProblemListForVisit(problemListModel: PatientProblemListModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateProblemListForVisit', problemListModel)
  }

  GetPatientProblemRecordbyID(problemListId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientProblemRecordbyID?ProblemlistId=' + problemListId);
  }

  DeletePatientProblemRecord(problemListId: number): Promise<any> {
    return this.http.get('/Registeration/DeletePatientProblemRecord?ProblemlistId=' + problemListId);
  }

 
  //Diagnosis
  getDiagnosisforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetDiagnosisforPatient?PatientId=' + PatientId).then(res => res);
  }

  getDiagnosisbyId(diagnosisID: number): Promise<any> {
    return this.http.get('/Registeration/GetDiagnosisRecordbyID?diagnosisID=' + diagnosisID).then(res => res);
  }
  deleteDiagnosisRecord(diagnosisID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteDiagnosisRecord?diagnosisID=' + diagnosisID).then(res => res);
  }

  //Procedure
  getProcedureforPatient(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetProceduresforPatient?patientId=' + patientId).then(res => res);
  }
  getprocedurebyId(procedureID: number): Promise<any> {
    return this.http.get('/Registeration/GetProcedureRecordbyID?procedureID=' + procedureID).then(res => res)
  }
  deleteProcedureRecord(procedureID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteProcedureRecord?procedureID=' + procedureID).then(res => res);
  }
  //patient Care plan
  bindcareplan(patientid: number): Promise<any> {
    return this.http.get('/Registeration/GetCarePlansforPatient?patientid=' + patientid).then(res => res);
  }
  bindcareplanId(careplanID: number): Promise<any> {
    return this.http.get('/Registeration/GetCarePlanRecordbyID?carePlanID=' + careplanID).then(res => res);
  }

  bindcareplanDelete(careplanID: number): Promise<any> {
    return this.http.get('/Registeration/DeleteCarePlanRecord?careplanID=' + careplanID).then(res => res);
  }



  //Patient Visit
  addUpdateVisit(PatientVisitModel: PatientVisitModel): Promise<any> {
    return this.http.post('/Visit/AddUpdateVisit', PatientVisitModel).then(res => res);
  }

  getPatientVisitbyId(PatientVisitId: number): Promise<any> {
    return this.http.get('/Visit/GetPatientVisitById?PatientVisitId=' + PatientVisitId).then(res => res);
  }

  getPatientVisit(patientId: number): Promise<any> {
    return this.http.get('/Visit/GetVisitsbyPatientID?PatientID=' + patientId).then(res => res);
  }
  getPatientCategory(): Promise<any> {
    return this.http.get('/Registeration/GetAllPatientCategories').then(res => res);
  }

  getPatientType(): Promise<any> {
    return this.http.get('/Registeration/GetAllPatientTypes').then(res => res);
  }
  getMaritalStatus(): Promise<any> {
    return this.http.get('/Registeration/GetMaritalStatusesForPatient').then(res => res);
  }

  getReligionPatient(): Promise<any> {
    return this.http.get('/Registeration/GetReligionsForPatient').then(res => res);
  }

  getRacesPatient(): Promise<any> {
    return this.http.get('/Registeration/GetRacesForPatient').then(res => res);
  }

  getGenderforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetGendersForPatient').then(res=>res);
  }
  
  getSalutionforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetSalutationsforPatient').then(res => res);
  }

  getContactTypeforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetContactTypesForPatient').then(res => res);
  }

  getBloodGroupforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetBloodGroupsforPatient').then(res => res);
  }

  getIllnesstype(): Promise<any> {
    return this.http.get('/Registeration/GetIllnessTypesforPatient').then(res => res);
  }

  getInsuranceType(): Promise<any> {
    return this.http.get('/Registeration/GetInsuranceTypesforPatient').then(res => res);
  }

  getInsurancecategory(): Promise<any> {
    return this.http.get('/Registeration/GetInsuranceCategoriesforPatient').then(res => res);
  }
  //physical Exam
  getPhysicalexamdetailsbyId(PhysicalExamID: number): Promise<any> {
    return this.http.get('/Registeration/GetPhysicalExamRecordbyID?PhysicalExamID=' + PhysicalExamID).then(res => res);
  }
  DeletePhysicalExamDetails(PhysicalExamID: number): Promise<any> {
    return this.http.get('/Registeration/DeletePhysicalExamRecord?PhysicalExamID=' + PhysicalExamID).then(res => res);
  }
  getPhysicalExamforPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPhysicalExamList?PatientId=' + PatientId).then(res => res);

  }
  
  AddUpdatePatientImmunizationData(immModel: immunizationModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePatientImmunizationData ', immModel).then(res => res);
  }

  GetPatientImmunizationList(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientImmunizationList?PatientId=' + PatientId).then(res => res);
  }

  GetPatientImmunizationRecordbyID(immunizationID: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientImmunizationRecordbyID?immunizationID=' + immunizationID).then(res => res);
  }


  DeletePatientImmunizationRecord(immunizationID: number): Promise<any> {
    return this.http.get('/Registeration/DeletePatientImmunizationRecord?immunizationID=' + immunizationID).then(res => res);
  }
  GetAdmissionType() {
    return this.http.get('/Registeration/GetAdmissionTypesforRegisteration').then(res => res);
  }
  GetAdmissionStatus() {
    return this.http.get('/Registeration/GetAdmissionStatusforRegisteration').then(res => res);
  }

  GetProblemStatuses() {
    return this.http.get('/Registeration/GetProblemStatusesforRegisteration').then(res => res);
  }

  GetProcedureTypes() {
    return this.http.get('/Registeration/GetProcedureTypesforRegisteration').then(res => res);
  }
  getAllAdmittingPhysicianData(searchkey: string) {
    return this.http.get('/Registeration/GetProvidersforRegisteration?searchKey=' + searchkey).then(res => res);
  }
  // medication
  getDispenseFormValue(): Promise<any> {
    return this.http.get("/Triage/GetDispenseFormData").then((res) => res);
  }

  getDosageFormValue(): Promise<any> {
    return this.http.get("/Triage/GetDosageFormData").then((res) => res);
  }
  getPrescriptionforvalues(): Promise<any> {
    return this.http.get("/Triage/GetAllPrescriptionOrderTypes").then((res) => res);
  }

  getMedicationUnitsIdvalues(): Promise<any> {
    return this.http.get('/Triage/GetMedicationUnits').then((res) => res);
  }
  getRouteIdvalue(): Promise<any> {
    return this.http.get('/Triage/GetMedicationRoutes').then((res) => res);
  }
  getMedicationStatusIdvalues(): Promise<any> {
    return this.http.get('/Triage/GetAllMedicationStatus').then((res) => res);
  }
  GetProviderNamesBySearch(searchKey: string): Promise<any> {
    return this.http.get('/Registeration/GetProvidersforRegisteration?searchKey=' + searchKey).then(res => res);
  }
  getProcedureStatus(): Promise<any> {
    return this.http.get('/Triage/GetProcedureStatusesforCaseSheet').then(res => res);
  }

  getReferredLab(): Promise<any> {
    return this.http.get('/Registeration/GetReferredLabsforPatient').then(res => res);
  }

  getReportFormatsforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetReportFormatsforPatient').then(res => res);
  }

  getBodySectionsforPatient(): Promise<any> {
    return this.http.get('/Registeration/GetBodySectionsforPatient').then(res => res);
  }
  getRadiologyType(): Promise<any> {
    return this.http.get('/Registeration/GetRadiologyTypesforPatient').then(res => res);
  }
  getRadiologyProcedureRequest(): Promise<any> {
    return this.http.get('/Registeration/GetRadiologyProcedureRequestedforPatient').then(res => res);
  }
//patient admission grid
  GetpatientadmissionID(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientAdmissions?PatientId=' + PatientId).then(res => res);
  }

//patient admsission view
Getpatientadmissionview(admissionID: number): Promise<any> {
  return this.http.get('/Registeration/GetAdmissionRecordByID?admissionID=' + admissionID).then(res => res);
}
getRoutevalue(): Promise<any> {
  return this.http.get('/Registeration/GetMedicationRouteforPatient').then(res => res);
}
getBodySitevalue(): Promise<any> {
  return this.http.get('/Registeration/GetBodySitesforPatient').then(res => res);
}
  //Patient Audiology
  getAudiologyRequestbyPatientId(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetAudiologyRequestsbyPatientId?patientId=' + patientId).then(res => res);
  }

  getAudiologyRecordbyVisit(visitId: number): Promise<any> {
    return this.http.get('/Registeration/GetAudiologyRecordsbyVisit?visitId=' + visitId).then(res => res);
  }
  //E-lab
  getTableDataOrder(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetELabOrdersbyPatient?patientId=' + patientId).then(res => res);
  }
  getViewRecordByOrder(orderNo: any): Promise<any> {
    return this.http.get('/Registeration/GetELabOrderbyOrderNo?orderNo=' + orderNo).then(res => res);
  }
  //add new Patient
  getStateValue(): Promise<any> {
    return this.http.get('/Registeration/GetStateListforPatient').then(res => res);
  }
  getCountryValue(): Promise<any> {
    return this.http.get('/Registeration/GetCountryListforPatient').then(res => res);
  }

  //Patient e-Prescription
  getMedicationbyPatientId(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetMedicationsbyPatient?patientId=' + patientId).then(res => res);
  }

  getMedicationRecord(medicationId: number): Promise<any> {
    return this.http.get('/Registeration/GetMedicationRecordbyIDfromPatient?medicationId=' + medicationId).then(res => res);
  }

  //Patient Discharge
  getDischargebyPatientId(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetDischargeRecordsforPatient?patientId=' + patientId).then(res => res);
  }

  getDischargeRecord(dischargeSummaryId: number): Promise<any> {
    return this.http.get('/Registeration/GetDischargeSummaryRecordbyID?dischargeSummaryId=' + dischargeSummaryId).then(res => res);
  }
  //FileUpload(File: FormData, Id: number, screen: string): Promise<any> {
  //  return this.http.postfile('/Registeration/UploadFile?Id=' + Id + '&screen=' + screen, File).then(res => res);
  //}
  FileUploadMultiple(File: any, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/Registeration/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }
  DeleteFile(path: any, fileName: any): Promise<any> {
    return this.http.get('/Registeration/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }
  // File Upload for Patient Diagnosis
  FileUpload(File: FormData, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/Registeration/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }

  // Remove Selected File from Patient Diagnosis
  RemoveFile(path: string, fileName: string): Promise<any> {
    return this.http.get('/Registeration/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }

     //GetFacilitiesforPatient
     getFacilitiesforpatient(): Promise<any> {
      return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
    }

      // Medication

  GetPatientMedicationHistoryListForPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientMedicationHistoryListForPatient?PatientId=' + PatientId);
  }//GetPatientMedicationHistoryListForPatient

  GetPatientMedicationHistoryRecordbyID(PatientMedicationId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientMedicationHistoryRecordbyID?PatientMedicationId=' + PatientMedicationId);
  }
  // AddUpdateMedicationHistoryForVisit(medicationModel: PatientMedicationHistoryModel): Promise<any> {
  //   return this.http.post('/Triage/AddUpdateMedicationHistoryForVisit', medicationModel)
  // }
  // DeletePatientMedicationRecord(PatientmedicationId: number): Promise<any> {
  //   return this.http.get('/Registeration/DeletePatientMedicationRecord?PatientmedicationId=' + PatientmedicationId);
  // }
}