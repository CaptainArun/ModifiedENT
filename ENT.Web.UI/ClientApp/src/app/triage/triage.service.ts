import { Injectable } from "@angular/core";
import { TriageSearchModel } from './models/triageSearchModel';
import { PatientVitalsModel } from './models/patientVitalsModel';
import { PatientAllergyModel } from './models/PatientAllergyModel';
import { PatientProblemListModel } from './models/patientProblemListModel';
import { PatientSocialHistoryModel } from './models/patientSocialHistoryModel';
import { NutritionAssessmentModel } from './models/nutritionAssessmentModel';
import { FunctionalCognitiveModel } from './models/functionalCognitiveModel';
import { DiagnosisModel } from './models/diagnosisModel';
import { ProcedureModel } from './models/procedureModel';
import { CarePlanModel } from './models/carePlanModel';
import { PatientROSModel } from './models/patientROSModel';
import { CustomHttpService } from '../core/custom-http.service';
import { PatientCaseSheetModel } from './models/patientCaseSheetModel';
import { NursingSignOffModel } from './models/nursingSignOffModel';
import { SurgeryRequestModel } from './models/surgeryRequestModel';
import { OPDNursingOrderModel } from './models/opdNursingOrderModel';
import { AudiologyRequestModel } from './models/audiologyRequestModel';
import { AdmissionRequestModel } from './models/AdmissionRequestModel';
import { signOffMOdel } from './models/signoffModel';
import { physicalExamModel } from './../patient/models/physicalExamModel';
import { AddProcedureRequestModel } from './../triage/models/AddProcedureRequestModel';
import { TriageMedicationRequestsModel } from "./models/triageMedicationRequestsModel";
import { TriageELabRequestModel } from './models/triageELabRequestModel';


@Injectable({
  providedIn: 'root'
})

export class TriageService {
  constructor(private http: CustomHttpService) { }

  getPatientForTriageSearch(): Promise<any> {
    return this.http.get('/Triage/GetPatientsForTriageSearch').then(res => res);
  }

  getCount(): Promise<any> {
    return this.http.get('/Triage/GetTriageCount').then(res => res);
  }

  getVisitNumberForSearch(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetVisitNumbersbySearch?searchKey='+ searchKey).then(res => res);
  }

  getFacilityNames(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

  GetPatientname(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetPatientsForTriageSearch?searchKey=' + searchKey).then(res => res);
  }

  GetDoctorname(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetProvidersforTriage?searchKey=' + searchKey).then(res => res);
  }

  getSpecialitiesForTriageSearch(): Promise<any> {
    return this.http.get('/Triage/GetSpecialitiesForTriageSearch').then(res => res);
  }

  getVisitedPatientsBySearch(triageSearchModel: TriageSearchModel): Promise<any> {
    return this.http.post('/Triage/GetVisitedPatientsBySearch', triageSearchModel);
  }

  getAllBPLocations(): Promise<any> {
    return this.http.get('/Triage/GetAllBPLocations').then(res => res);
  }

  getAllergyTypes(): Promise<any> {
    return this.http.get('/Triage/GetAllergyTypes').then(res => res);
  }

  getAllergySeverities(): Promise<any> {
    return this.http.get('/Triage/GetAllergySeverities').then(res => res);
  }

  getAllDiagnosisCodes(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllDiagnosisCodes?searchKey=' + searchKey).then(res => res);
  }

  getAllTreatmentCodes(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllTreatmentCodes?searchKey=' + searchKey).then(res => res);
  }

  getAllSnomedCTCodes(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllSnomedCTCodes?searchKey=' + searchKey).then(res => res);
  }

  getAllFoodIntakeTypes(): Promise<any> {
    return this.http.get('/Triage/GetAllFoodIntakeTypes').then(res => res);
  }

  getAllFacilitiesForTriage(): Promise<any> {
    return this.http.get('/Triage/GetAllFacilitiesForTriage').then(res => res);
  }

  getAllProvidersForTriage(): Promise<any> {
    return this.http.get('/Triage/GetAllProvidersForTriage').then(res => res);
  }

  getAllAppointmentTypes(): Promise<any> {
    return this.http.get('/Triage/GetAllAppointmentTypes').then(res => res);
  }

  getAllAppointmentStatuses(): Promise<any> {
    return this.http.get('/Triage/GetAllAppointmentStatuses').then(res => res);
  }

  getAllProblemAreavalues(): Promise<any> {
    return this.http.get('/Triage/GetAllProblemAreavalues').then(res => res);
  }

  getAllProblemTypes(): Promise<any> {
    return this.http.get('/Triage/GetAllProblemTypes').then(res => res);
  }

  getAllSymptoms(): Promise<any> {
    return this.http.get('/Triage/GetAllSymptoms').then(res => res);
  }

  getAllRequestedProcedures(): Promise<any> {
    return this.http.get('/Triage/GetAllRequestedProcedures').then(res => res);
  }

  addUpdateVitalsforVisit(patientVitalsModel: PatientVitalsModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateVitalsforVisit', patientVitalsModel);
  }

  addUpdateAllergyCollection(allergyCollection: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateAllergyCollection', allergyCollection);
  }

  addUpdateProblemListCollection(problemListCollection: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateProblemListCollection', problemListCollection);
  }

  addUpdateMedicationHistoryCollection(patientMedicationHistory: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateMedicationHistoryCollection', patientMedicationHistory);
  }

  addUpdateSocialHistoryForVisit(patientSocialHistoryModel: PatientSocialHistoryModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateSocialHistoryForVisit', patientSocialHistoryModel);
  }

  addUpdateROSForVisit(patientROSModel: PatientROSModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateROSForVisit', patientROSModel);
  }

  addUpdateNutritionCollection(nutritionAssessmentCollection: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateNutritionCollection', nutritionAssessmentCollection);
  }

  addUpdateFunctionalandCognitiveForVisit(functionalCognitiveModel: FunctionalCognitiveModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateFunctionalandCognitiveForVisit', functionalCognitiveModel);
  }

  addUpdateNursingSignOffData(nursingModel: NursingSignOffModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateNursingSignOffData', nursingModel);
  }

  getcaseSheetDataForVisit(visitId: number) {
    return this.http.get('/Triage/GetcaseSheetDataForVisit?VisitId=' + visitId);
  }

  addUpdateDiagnosisForVisitcase(diagnosisModel: DiagnosisModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateDiagnosisForVisitcase', diagnosisModel);
  }
  //patient care plan
  addUpdateCareplan(carePlanModel: CarePlanModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateCarePlanForVisitCase', carePlanModel);
  }


  addUpdateProcedureForVisitcase(procedureModel: ProcedureModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateProcedureForVisitcase', procedureModel);
  }

  addUpdateCarePlanForVisitCase(careModel: CarePlanModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateCarePlanForVisitCase', careModel);
  }

  addUpdateEPrescriptions(ePrescriptionCol: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateePrescriptions', ePrescriptionCol);
  }

  addUpdateElabOrders(eLabOrdersCollection: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateelabOrders', eLabOrdersCollection);
  }

  addUpdateCaseSheetDetails(caseSheetModel: PatientCaseSheetModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateCaseSheetDetails', caseSheetModel);
  }

  addUpdateSurgeryRequest(surgeryRequestModel: SurgeryRequestModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateSurgeryRequest', surgeryRequestModel);
  }

  getVisitIntakeDataForVisit(patientId: number, visitId: number): Promise<any> {
    return this.http.get('/Triage/GetVisitIntakeDataForVisit?PatientID=' + patientId + '&VisitID=' + visitId);
  }

  getAllPrescriptionOrderTypes(): Promise<any> {
    return this.http.get('/Triage/GetAllPrescriptionOrderTypes').then(res => res);
  }

  getMedicationUnits(): Promise<any> {
    return this.http.get('/Triage/GetMedicationUnits').then(res => res);
  }

  getMedicationRoutes(): Promise<any> {
    return this.http.get('/Triage/GetMedicationRoutes').then(res => res);
  }

  getAllMedicationStatus(): Promise<any> {
    return this.http.get('/Triage/GetAllMedicationStatus').then(res => res);
  }

  getOPDNursingDataForVisit(visitId: number): Promise<any> {
    return this.http.get('/Triage/GetOPDNursingDataForVisit?VisitID=' + visitId).then(res => res);
  }

  addUpdateOPDNursingOrders(nursingModel: OPDNursingOrderModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateOPDNursingOrders', nursingModel);
  }

  getVisitForPatient(PatientId: number): Promise<any> {
    return this.http.get('/Triage/GetVisitsForPatient?PatientID=' + PatientId).then(res => res);
  }

  getProviderNames(FacilityId: number): Promise<any> {
    return this.http.get('/Triage/GetProviderNames?facilityId=' + FacilityId).then(res => res);
  }
  getsmoking(): Promise<any> {
    return this.http.get('/Triage/GetAllSmokingMasters').then(res => res);
  }
  getdrinking(): Promise<any> {
    return this.http.get('/Triage/GetAllDrinkingMasters').then(res => res);
  }
  getcareplanstatus(): Promise<any> {
    return this.http.get('/Triage/GetAllCarePlanStatusMasters',).then(res => res);
  }
  getcareplanprogress(): Promise<any> {
    return this.http.get('/Triage/GetAllCarePlanProgressMasters',).then(res => res);
  }

  //visit intake summury

  GetVisitIntakeDataForVisit(PatientID: number, VisitID: number): Promise<any> {
    return this.http.get('/Triage/GetVisitIntakeDataForVisit?PatientID=' + PatientID + '&VisitID=' + VisitID).then(res => res);
  }
  // audiology request choose one

  AddUpdateAudiologyRequest(audiologyRequestModel: AudiologyRequestModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateAudiologyRequest', audiologyRequestModel);
  }

  GetAudiologyRequestsForPatient(PatientId: number): Promise<any> {
    return this.http.get('/Triage/GetAudiologyRequestsForPatient?PatientID=' + PatientId).then(res => res);
  }

  //audiology procedure

  GetAudiologyRecords(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetAudiologyRecords?VisitId=' + VisitId).then(res => res);
  }

  GetAudiologyDoctors(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAudiologyDoctors?searchKey=' + searchKey).then(res => res);
  }
  AddUpdateAdmissionRequest(admissionRequestModel: AdmissionRequestModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateAdmissionRequest', admissionRequestModel).then(res => res);
  }

  GetAdmissionrequestforVisit(admissionRequestId: number): Promise<any> {

    return this.http.get('/Triage/GetAdmissionrequestforVisit?admissionRequestId=' + admissionRequestId).then(res => res);
  }

  GetVisitsForPatient(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVisitsForPatient?PatientId=' + PatientId).then(res => res);


  }
  //Physical exam
  addUpdatephysicalexamForVisit(physicalExamModel: physicalExamModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePhysicalExamData', physicalExamModel);
  }

  GetProviderNames(facilityId: number): Promise<any> {

    return this.http.get('/Registeration/GetProviderNames?facilityId =' + facilityId).then(res => res);
  }

  signoffModel(signoffModel: signOffMOdel): Promise<any> {
    return this.http.post('/Triage/SignoffUpdationforTriage', signoffModel).then(res => res);
  }
  //procedure request
  getUrgencyId(): Promise<any> {
    return this.http.get('/Triage/GetUrgencyTypes').then(res => res);
  }
  getProcedureType(): Promise<any> {
    return this.http.get('/Triage/GetProcedureTypesforCaseSheet').then(res => res);
  }
  getAdmittingPhysician(facilityId: number): Promise<any> {
    return this.http.get('/Triage/GetAllProvidersForTriage', facilityId).then(res => res);
  }
  getInitialAdmissionStatus(): Promise<any> {
    return this.http.get('/Triage/GetAdmissionStatusforTriage').then(res => res);
  }
  getadmissionType(): Promise<any> {
    return this.http.get('/Triage/GetAdmissionTypesforTriage').then(res => res);
  }
  getAllProcedureName(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetProceduresforProcedureRequest?searchKey=' + searchKey).then(res => res);
  }
  GetVisitsForPatientprocedure(PatientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVisitsForPatient?PatientId=' + PatientId).then(res => res);


  }


  AddUpdateAddProcedureRequest(AddProcedureReq: AddProcedureRequestModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateProcedureRequest', AddProcedureReq).then(res => res);
  }
  getDataOfProcedure(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetProcedureRequestforVisit?VisitId=' + VisitId).then(res => res);
  }
  getVisitRecordById(visitId: number): Promise<any> {
    return this.http.get('/Triage/GetVisitRecordById?VisitId=' + visitId);
  }
  getAudiologyRequestRecordByVisitID(visitId: number): Promise<any> {
    return this.http.get('/Triage/GetAudiologyRequestRecordbyVisitID?visitId=' + visitId);
  }
  getOneAdmittingPhysician(VisitId: number): Promise<any> {

    return this.http.get('/Triage/GetVisitRecordById?VisitId=' + VisitId).then(res => res);

  }
  GetBalanceListforIntake() {
    return this.http.get('/Triage/GetBalanceListforIntake').then(res => res);
  }

  GetMobilitiesforIntake() {
    return this.http.get('/Triage/GetMobilitiesforIntake').then(res => res);
  }
  getproblemstatusvalue(): Promise<any> {
    return this.http.get('/Triage/GetProblemStatusesforCaseSheet').then(res => res);
  }
  getPatientPositionvalue(): Promise<any> {
    return this.http.get('/Triage/GetPatientPositionsforIntake').then(res => res);
  }
  getTemperatureLocationvalue(): Promise<any> {
    return this.http.get('/Triage/GetTemperatureLocationsforIntake').then(res => res);
  }
  getPainScaleValue(): Promise<any> {
    return this.http.get('/Triage/GetPainScalesforIntake').then(res => res);
  }
  GetGaitvalue() {
    return this.http.get('/Triage/GetGaitMasterValues').then(res => res);
  }
  getProblemStatus(): Promise<any> {
    return this.http.get('/Triage/GetProblemStatusesforCaseSheet').then(res => res);
  }

  getProcedureStatus(): Promise<any> {
    return this.http.get('/Triage/GetProcedureStatusesforCaseSheet').then(res => res);
  }

  getPainScale(): Promise<any> {
    return this.http.get('/Triage/GetPainScalesforIntake').then(res => res);
  }

  getTreatmentTypes(): Promise<any> {
    return this.http.get('/Triage/GetTreatmentTypes').then(res => res);
  }
  getallergyStatusvalue(): Promise<any> {
    return this.http.get('/Triage/GetAllergyStatusMasters').then(res => res);
  }
  getIntakeCategoryValue(): Promise<any> {
    return this.http.get('/Triage/GetAllFoodIntakeMasters').then(res => res);
  }
  getEatRegularlyvalue(): Promise<any> {
    return this.http.get('/Triage/GetAllPatientEatMasters').then(res => res);
  }
  // e-Prescription
  getDrugCode(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllDrugCodes?searchKey=' + searchKey).then(res => res);
  }

  getRoute(): Promise<any> {
    return this.http.get('/Triage/GetMedicationRoutes').then(res => res);
  }

  getDiagnosisCode(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllDiagnosisCodes?searchKey=' + searchKey).then(res => res);
  }

  getMedicationRequestForVisit(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetMedicationRequestForVisit?VisitId=' + VisitId);
  }

  addUpdateMedicationRequestforVisit(medicationRequestModel: TriageMedicationRequestsModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateMedicationRequestforVisit', medicationRequestModel);
  }

  // e-Lab
  getELabTestName(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetELabSetupMastersbySearchfromTriage?searchKey=' + searchKey).then(res => res);
  }

  getELabRequestforVisit(visitId: number): Promise<any> {
    return this.http.get('/Triage/GetELabRequestforVisit?visitId=' + visitId);
  }

  addUpdateELabRequest(eLabRequestModel: TriageELabRequestModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateELabRequestfromTriage', eLabRequestModel);
  }
  // File Upload for Patient Diagnosis
  FileUpload(File: FormData, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/Triage/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }

  // Remove Selected File from Patient Diagnosis
  RemoveFile(path: string, fileName: string): Promise<any> {
    return this.http.get('/Triage/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }

  // Images
  getDiagnosisRecordById(visitId: number): Promise<any> {
    return this.http.get('/Triage/GetDiagnosisRecordwithImages?visitId=' + visitId);
  }

  getPreviousVisitRecordById(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetPreviousVisitsbyVisitId?VisitId=' + VisitId);
  }

  //Visit Intake Single Record Update
  addSingleAllergyRecord(PatientAllergyModel: PatientAllergyModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateAllergiesForVisit', PatientAllergyModel);
  }

  addSingleProblemListRecord(PatientProblemListModel: PatientProblemListModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateProblemListForVisit', PatientProblemListModel);
  }

  addSingleNutritionecord(NutritionAssessmentModel: NutritionAssessmentModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateNutritionForVisit', NutritionAssessmentModel);
  }
  addUpdateMedicationTriage(Collection: any): Promise<any> {
    return this.http.post('/Triage/AddUpdateMedicationHistoryCollection', Collection);
  }

  addSingleNutritionRecord(NutritionAssessmentModel: NutritionAssessmentModel): Promise<any> {
    return this.http.post('/Triage/AddUpdateNutritionForVisit', NutritionAssessmentModel);
  }

  deleteAllergySingleRecord(AllergyId: number): Promise<any> {
    return this.http.get('/Triage/DeleteAllergyRecord?AllergyId=' + AllergyId).then(res => res);
  }

  DeletePatientProblemRecord(problemListId: number): Promise<any> {
    return this.http.get('/Triage/DeletePatientProblemRecord?problemListId=' + problemListId).then(res => res);
  }

  DeleteNutritionRecord(nutritionAssessmentId: number): Promise<any> {
    return this.http.get('/Triage/DeleteNutritionRecord?nutritionAssessmentId=' + nutritionAssessmentId).then(res => res);
  }
  DeleteMedicationRecord(patientMedicationId: number): Promise<any> {
    return this.http.get('/Triage/DeleteMedicationHistoryRecordbyID?patientMedicationId=' + patientMedicationId).then(res => res);
  }
}
