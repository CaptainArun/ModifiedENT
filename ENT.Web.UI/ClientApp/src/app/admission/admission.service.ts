import { Injectable } from '@angular/core';
import { CustomHttpService } from '../core/custom-http.service';
import { promise } from 'protractor';
import { admission01Model } from './Models/admission01Model';
import { NewPatientRegModel } from '../patient/models/newPatientRegModel';
import { admissionsearchmodel } from '../admission/Models/admissionsearchmodel';
import { admissionsmodel } from '../admission/Models/admissionsmodel';
import { ProcedureConvertModel } from '../admission/Models/procedure-conertModel';
import { AdmissionPaymentModel } from './Models/AdmissionPaymentModel';


@Injectable({
  providedIn: 'root'
})

export class AdmissionService {

  patientId: number;
  admissionPaymentViewItem: any;
  constructor(private http: CustomHttpService) { }
  getadmission(): Promise<any> {
    return this.http.get('/Admission/GetAllAdmissions').then(res => res);
  }
  getadmissioncount(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionCounts').then(res => res);
  }

  GetAdmissionTypes(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionTypesforAdmission').then(res => res);
  }

  GetPatientarrival(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalConditions').then(res => res);
  }
  addadmission(admissionsModel: admissionsmodel): Promise<any> {
    return this.http.post('/Admission/AddUpdateAdmissions', admissionsModel);
  }

  GetPatientArrivalbyValues(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalbyValues').then(res => res);
  }
  GetAdmissionStatusesforAdmission(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionStatusesforAdmission').then(res => res);
  }
  GetProcedureTypesforAdmission(): Promise<any> {
    return this.http.get('/Admission/GetProcedureTypesforAdmission').then(res => res);
  }
  GetUrgencyTypes(): Promise<any> {
    return this.http.get('/Admission/GetUrgencyTypesforAdmission').then(res => res);
  }

  GetrAdmission(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionNumber').then(res => res);
  }

  searchAdmission(SearchModel: admissionsearchmodel): Promise<any> {
    return this.http.post('/Admission/GetAdmissionsBySearch', SearchModel).then(res => res);
  }

  GetVisitsForPatient(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetVisitsForPatient?PatientId=' + patientId).then(res => res);
  }
  GetIcd(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetDiagnosisCodes?searchKey=' + searchKey).then(res => res);
  }
  GetAllProvidersForAdmission(): Promise<any> {
    return this.http.get('/Admission/GetAllProvidersForAdmission').then(res => res);
  }
  GetProceduresforAdmission(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetProceduresforAdmission?searchKey=' + searchKey).then(res => res);
  }
  Gettreatment(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetTreatmentCodes?searchKey=' + searchKey).then(res => res);
  }

  Getspecialities(): Promise<any> {
    //return this.http.get('/Admission/GetSpecialitiesForAdmissionSearch').then(res => res);
    return this.http.get('/Admission/GetSpecialities').then(res => res);
  }


  GetOrderingphysician(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetProvidersforAdmissionSearch?searchKey=' + searchKey).then(res => res);
  }
  Getpatientname(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetPatientsForAdmissionSearch?searchKey=' + searchKey).then(res => res);
  }

  AddUpdateAdmissions(newAdmission: admission01Model): Promise<any> {
    return this.http.post('/Admission/AddUpdateAdmissions', newAdmission).then(res => res)
  }

  GetAllAdmissions(): Promise<any> {
    return this.http.get('/Admission/GetAllAdmissions').then(res => res);
  }

  addUpdatePatientDetail(patientRegModel: NewPatientRegModel): Promise<any> {
    return this.http.post('/Registeration/AddUpdatePatientData', patientRegModel);
  }

  GetSpecialities(): Promise<any> {
    return this.http.get('/Admission/GetSpecialities').then(res => res);
  }

  GetPatientArrivalConditions(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalConditions').then(res => res);
  }

  GetTreatmentCodes(searchkey: string): Promise<any> {
    return this.http.get('/Admission/GetTreatmentCodes?searchKey=' + searchkey).then(res => res);
  }

  GetAdmissionDetailByID(admissionID: number): Promise<any> {
    return this.http.get('/Admission/GetAdmissionDetailByID?admissionID=' + admissionID).then(res => res);
  }

  DeleteAdmissionRecord(admissionID: string): Promise<any> {
    return this.http.get('/Admission/DeleteAdmissionRecord?admissionID=' + admissionID).then(res => res);
  }

  GetAllAdmissionReq(): Promise<any> {
    return this.http.get('/Admission/GetAllrequestsforAdmissions').then(res => res);
  }

  GetAdmissionReqbyId(admissionRequestId: number): Promise<any> {
    return this.http.get('/Admission/GetAdmissionRequestbyID?admissionRequestId=' + admissionRequestId).then(res => res);
  }
  GetProviderNames(facilityId: number): Promise<any> {
    return this.http.get('/Admission/GetProviderNamesForAdmission?facilityId=' + facilityId).then(res => res);
  }

  getPatientArrivalBy(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalbyValues').then(res => res);
  }

  getAdmissionType(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionTypesforAdmission').then(res => res);
  }

  changeAdmissionStatus(admissionRequestId: number, status: string): Promise<any> {
    return this.http.get('/Admission/ChangeAdmissionStatus?admissionRequestId=' + admissionRequestId + '&status=' + status).then(res => res);
  }

  getAdmissionNumber(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionNumber').then(res => res);
  }
  getAdmittingPhysician(facilityId: number): Promise<any> {
    return this.http.get('/Triage/GetAllProvidersForTriage', facilityId).then(res => res);
  }
  getAllDiagnosisCodes(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllDiagnosisCodes?searchKey=' + searchKey).then(res => res);
  }
  getProcedureType(): Promise<any> {
    return this.http.get('/Triage/GetProcedureTypesforCaseSheet').then(res => res);
  }
  getAllProcedureName(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetProceduresforProcedureRequest?searchKey=' + searchKey).then(res => res);
  }
  getAllTreatmentCodes(searchKey: string): Promise<any> {
    return this.http.get('/Triage/GetAllTreatmentCodes?searchKey=' + searchKey).then(res => res);
  }
  getUrgencyId(): Promise<any> {
    return this.http.get('/Triage/GetUrgencyTypes').then(res => res);
  }
  getPatientArrivalCondtion(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalConditions').then(res => res);
  }
  getPatientArrBy(): Promise<any> {
    return this.http.get('/Admission/GetPatientArrivalbyValues').then(res => res);
  }
  getInitialAdmissionStatus(): Promise<any> {
    return this.http.get('/Admission/GetAdmissionStatusesforAdmission').then(res => res);
  }
  AddUpdateProcedure(ProcedureConvertModel: ProcedureConvertModel): Promise<any> {
    return this.http.post('/Admission/AddUpdateAdmissions', ProcedureConvertModel).then(res => res)
  }
  changeProcedureStatus(ProcedureRequestId: number): Promise<any> {
    return this.http.get('/Admission/ConfirmProcedureStatus?ProcedureRequestId=' + ProcedureRequestId).then(res => res);
  }
  GetAllProcedureReq(): Promise<any> {
    return this.http.get('/Admission/GetProcedureRequestsforAdmission').then(res => res);
  }
  admissionPaymentDetail(admissionID: number): Promise<any> {
    return this.http.get('/Admission/GetPaymentRecordforAdmissionbyID?admissionID=' + admissionID).then(res => {
      this.admissionPaymentViewItem = res;
    }
    );

  }
  GetBillNumber(): Promise<any> {
    return this.http.get('/Visit/GetBillNumber').then(res => res);
  }
  AddUpdateAdmissionPayment(paymentModel: AdmissionPaymentModel): Promise<any> {

    return this.http.post('/Admission/AddUpdateAdmissionPayment', paymentModel);
  }
  GetReceiptNumber(): Promise<any> {
    return this.http.get('/Visit/GetReceiptNumber').then(res => res);
  }
  GetDepartmentsfromMaster(searchKey: string): Promise<any> {
    return this.http.get('/Billing/GetDepartmentsfromMaster?searchKey=' + searchKey).then(res => res);
  }
  GetbillingParticulars(departmentID: number, searchKey: string): Promise<any> {

    //return this.http.get('/Admission/GetbillingParticularsforAdmissionPayment?departmentID=' +departmentID + '&searchKey=' + searchKey).then(res => res);
    return this.http.get('/Billing/GetbillingParticulars?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res);

  }

  GetProcedureReqbyId(procedureRequestId: number): Promise<any> {
    return this.http.get('/Admission/GetProcedureRequestbyId?procedureRequestId=' + procedureRequestId).then(res => res);
  }
  GetPaymentTypeListforAdmission() {
    return this.http.get('/Admission/GetPaymentTypeListforAdmission').then(res => res);
  }

  
  getFacility() {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
  
  getProvidersbyfacilityId(faciltyId: number): Promise<any> {
    return this.http.get('/Appointment/GetProvidersbyFacility?facilityID=' + faciltyId).then(res => res);
  }

  getAdmissionNumberBySearch(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetAdmissionNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }
 
  getVisitNumberbySearch(searchKey: string): Promise<any> {
    return this.http.get('/Admission/GetVisitNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }

  searchProcedureRequest(SearchModel: admissionsearchmodel): Promise<any> {
    return this.http.post('/Admission/GetProcedureRequestsforAdmissionBySearch', SearchModel).then(res => res);
  }
  getprocedureRequestCount(): Promise<any> {
    return this.http.get('/Admission/GetProcedureRequestCounts').then(res => res);
  }
}
