import { Injectable } from "@angular/core";
import { PatientVisitModel, PatientVisitSearchModel } from './models/patientVisitModel';
import { CustomHttpService } from '../core/custom-http.service';
import { VisitPaymentModel } from './models/VisitPaymentModel';

@Injectable({
  providedIn: 'root'
})

export class VisitService {

  visitPaymentVisitId :any;
  visitPaymentData :any;
  visitPaymentViewItem :any;
  visitId :any;

  constructor(private http: CustomHttpService) { }

  getUserProfileData():Promise <any> {
    return this.http.get('/Auth/GetImageforCurrentUser').then(res => res);
  }
  
  getVisitCount(): Promise<any> {
    return this.http.get('/Visit/TodayVisitCounts').then(res => res);
  }

  getAppointmentCountsforVisit(): Promise<any> {
    return this.http.get('/Visit/TodayAppointmentCountsforVisit').then(res => res);
  }

  getVisitType(): Promise<any> {
    return this.http.get('/Visit/GetAllVisitTypes').then(res => res);
  }

  getAllRecordedDuringOptions(): Promise<any> {
    return this.http.get('/Visit/GetAllRecordedDuringOptions').then(res => res);
  }

  getUrgencyType(): Promise<any> {
    return this.http.get('/Visit/GetAllUrgencyTypes').then(res => res);
  }

  getPatientArraivalCondition(): Promise<any> {
    return this.http.get('/Visit/GetAllArrivalConditions').then(res => res);
  }

  getHospital(): Promise<any> {
    return this.http.get('/Visit/GetFacilitiesforVisits').then(res => res);
  }

  getToConsult(): Promise<any> {
    return this.http.get('/Visit/GetProvidersforVisits').then(res => res);
  }
  getGetProvidersConsult(FacilityID: any): Promise<any> {
    return this.http.get('/Visit/GetProvidersbyFacility?facilityID=' + FacilityID).then(res => res);
  }

  getVisitStatus(): Promise<any> {
    return this.http.get('/Visit/GetAllVisitStatuses').then(res => res);
  }

  getAllPatientVisits(): Promise<any> {
    return this.http.get('/Visit/GetAllPatientVisits').then(res => res);
  }

  addUpdateVisit(patientVisitModel: PatientVisitModel): Promise<any> {
    return this.http.post('/Visit/AddUpdateVisit', patientVisitModel).then(res => {
      this.visitPaymentVisitId = res.VisitId;
    });
  }

  //visitPayment list
  GetAllVisitPayments(): Promise<any> {
    return this.http.get('/Visit/GetAllVisitPayments').then(res => {
      this.visitPaymentData = res;
    });
  }

  getPatientVisitByVisitId(VisitId: any): Promise<any> {
    return this.http.get('/Visit/GetPatientVisitById?PatientVisitId=' + VisitId).then(res => res);
  }

  getVisitsbyPatientID(patientId: any): Promise<any> {
    return this.http.get('/Visit/GetVisitsbyPatientID?PatientID=' + patientId).then(res => res);
  }


  //departmets...
  GetDepartmentsfromMaster(searchKey: string): Promise<any> {

    return this.http.get('/Billing/GetDepartmentsfromMaster?searchKey=' + searchKey).then(res => res);
  }


  GetbillingParticulars(departmentID: number, searchKey: string): Promise<any> {

    return this.http.get('/Billing/GetbillingParticulars?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res);
  }

  AddUpdateVisitPayment(paymentModel: VisitPaymentModel): Promise<any> {
    return this.http.post('/Visit/AddUpdateVisitPayment', paymentModel);
  }


  GetReceiptNumber(): Promise<any> {
    return this.http.get('/Visit/GetReceiptNumber').then(res => res);
  }

  GetBillNumber(): Promise<any> {
    return this.http.get('/Visit/GetBillNumber').then(res => res);
  }

  visitPaymentDetail(visitId: number): Promise<any> {
    return this.http.get('/Visit/GetPaymentRecordforVisitbyID?VisitId=' + visitId).then(res => {
      this.visitPaymentViewItem = res;
    }
    );
  }

  ConsultationTypesForVisit() {
    return this.http.get('/Visit/GetConsultationTypesForVisit').then(res => res);
  }

  AppointmentBookedListForVisit() {
    return this.http.get('/Visit/GetAppointmentBookedListForVisit').then(res => res);
  }

  GetPaymentTypeListforVisit() {
    return this.http.get('/Visit/GetPaymentTypeListforVisit').then(res => res);
  }

  //
  getPatientVisitSearchData(searchModel: PatientVisitSearchModel): Promise<any> {
    return this.http.post('/Visit/GetPatientVisitsbySearch', searchModel).then(res => res);
  }

  getAppointmentsforSearchData(searchModel: PatientVisitSearchModel): Promise<any> {
    return this.http.post('/Visit/GetAppointmentsforVisitbySearch', searchModel).then(res => res);
  }


  getProvidersforVisitSearch(searchKey: string): Promise<any> {
    return this.http.get('/Visit/GetProvidersforVisitSearch?searchKey=' + searchKey).then(res => res);
  }

  getPatientsForVisitSearch(searchKey: string): Promise<any> {
    return this.http.get('/Visit/GetPatientsForVisitSearch?searchKey=' + searchKey).then(res => res);
  }

  getPatientDetailsById(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientDetailById?PatientId=' + patientId).then(res => res);
  }

  //
  getVisitParticularHistoryCountData(patientId): Promise<any> {
    return this.http.get('/Visit/VisitCountsforPatient?patientId=' + patientId);
  }

  getVisitParticularHistoryById(PatientID): Promise<any> {
    return this.http.get('/Visit/GetVisitsbyPatientID?PatientID=' + PatientID);
  }

  //
  getAllappointmentList(): Promise<any> {
    return this.http.get('/Visit/GetAppointmentsforVisit').then(res => res);
  }

  getAppointmentRecordById(AppointmentId): Promise<any> {
    return this.http.get('/Visit/GetAppointmentRecordById?AppointmentId=' + AppointmentId);
  }


  confirmVisitfromAppointment(appointmentId: number): Promise<any> {
    return this.http.get('/Visit/ConfirmVisitfromAppointment?appointmentId=' + appointmentId).then(res => res);
  }

  getOrderNumber(): Promise<any> {
    return this.http.get('/Visit/GetVisitNo').then(res => res);
  }

  getVisitNumberBySearch(searchKey: string): Promise<any> {
    return this.http.get('/Visit/GetVisitNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }


  getFacilitiesforVisits(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

  getAppointmentNumberBySearch(searchkey: string): Promise<any> {
    return this.http.get('/Visit/GetAppointmentNumbersbySearch?searchkey=' + searchkey).then(res => res);
  }

  getPatientVisitHistory(VisitId: any): Promise<any> {
    return this.http.get('/Visit/VisitHistory?PatientVisitId=' + VisitId).then(res => res);
  }
 
}
