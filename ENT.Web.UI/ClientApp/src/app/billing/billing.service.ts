import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { BillingMasterModel } from "./models/BillingMasterModel";
import { BillingSetupModel } from "./models/BillingSetupModel";
import { BillingSubMasterModel } from "./models/BilllingSubMasterModel";
import { MasterBillingPaymentModel } from "./models/masterBillingPayment";
import { BillingPaymentRefundSearchModel } from './models/BillingPaymentRefundSearchModel';
import { BillingPaymentRefundModel } from './models/BillingPaymentRefundModel';
@Injectable({
  providedIn: 'root'
})

export class billingService {
    
  constructor(private http: CustomHttpService) { }

//Billing-master


//#region DeleteBillingMasterRecord
DeleteBillingMasterRecord(billingMasterID: number): Promise<any> {
  return this.http.get('/Billing/DeleteBillingMasterRecord?billingMasterID=' + billingMasterID).then(res => res);
}
//#endregion


//#region BillingMasterRecord
GetBillingMasterRecordbyID(billingMasterID: number): Promise<any> {
  return this.http.get('/Billing/GetBillingMasterRecordbyID?billingMasterID=' + billingMasterID).then(res => res);
}
//#endregion

//#region BillingMasterList
GetBillingStatus(): Promise<any> {
  return this.http.get('/Billing/GetAllBillingStatuses').then(res => res);
}

GetBillingMasterList(): Promise<any> {

  return this.http.get('/Billing/GetBillingMasterList').then(res => res);
}
//#endregion


//#region UpdateBillingMasterData

AddUpdateBillingMasterData(MasterModel: BillingMasterModel): Promise<any> {
  return this.http.post('/Billing/AddUpdateBillingMasterData', MasterModel).then(res => res);
}

//#endregion


//#region DepartmentsList
GetDepartmentsList(searchKey: string): Promise<any> {

  return this.http.get('/Billing/GetDepartmentList?searchKey=' + searchKey).then(res => res)
}
//#endregion


//Billing submaster

DeleteBillingSubMasterRecord(billingSubMasterID: number): Promise<any> {
  return this.http.get('/Billing/DeleteBillingSubMasterRecord?billingSubMasterID=' + billingSubMasterID).then(res => res);
}

GetBillingSubMasterRecordbyID(billingSubMasterID: number): Promise<any> {
  return this.http.get('/Billing/GetBillingSubMasterRecordbyID?billingSubMasterID=' + billingSubMasterID).then(res => res);
}

GetBillingSubMasterList(): Promise<any> {

  return this.http.get('/Billing/GetBillingSubMasterList').then(res => res);
}


AddUpdateBillingSubMasterData(SubMasterModel: BillingSubMasterModel): Promise<any> {
  return this.http.post('/Billing/AddUpdateBillingSubMasterData', SubMasterModel).then(res => res);
}

GetSubMasterallowedBillingTypes(departmentID: number, searchKey: string) {

  return this.http.get('/Billing/GetSubMasterallowedBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey ) .then(res => res)
}


DeleteSetUpMasterRecord(setupMasterID: number): Promise<any> {
  return this.http.get('/Billing/DeleteSetUpMasterRecord?setupMasterID=' + setupMasterID).then(res => res);
}

GetSetupMasterRecordbyID(setupMasterID: number): Promise<any> {
  return this.http.get('/Billing/GetSetupMasterRecordbyID?setupMasterID=' + setupMasterID).then(res => res);
}

getSubMasterBillingTypesforMasterBillingType(departmentID: number, searchKey: string) {

  return this.http.get('/Billing/GetMasterBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res)

} 

SubMasterBillingTypesforMasterBillingType(masterBillingID: number, searchKey: string) {

  return this.http.get('/Billing/GetSubMasterBillingTypesforMasterBillingType?masterBillingID=' + masterBillingID + '&searchKey=' + searchKey).then(res => res)
}



AddUpdateBillingSetupMasterData(billingSetupModel: BillingSetupModel): Promise<any> {
  return this.http.post('/Billing/AddUpdateBillingSetupMasterData', billingSetupModel).then(res => res);
}

GetAllSetupMasterData(): Promise<any> {

  return this.http.get('/Billing/GetAllSetupMasterData').then(res => res);
}

GetMasterBillingTypes(departmentID: number, searchKey: string) {

  return this.http.get('/Billing/GetMasterBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res)
}


  getAllPatientData(searchKey: string): Promise<any> {
    return this.http.get('/Billing/GetPatientsForBillingandPaymentSearch?searchKey=' + searchKey).then(res => res);
  }


  getPatientDetailsById(PatientId: number): Promise<any> {
    return this.http.get('/Billing/GetPatientRecordById?PatientId=' + PatientId).then(res => res);
  }

  GetReceiptNumber(): Promise<any> {
    return this.http.get('/Billing/GetReceiptNumberforBilling').then(res => res);
  }

  GetBillNumber(): Promise<any> {
    return this.http.get('/Billing/GetBillNumberforBilling').then(res => res);
  }


  getVisitAdmissionDateandtime(billType:string,patientId:number){
    return this.http.get('/Billing/GetVisitorAdmissionDetailsforPaymentScreen?billType=' + billType + '&patientId=' + patientId).then(res => res);
  }

  AddUpdateVisitPaymentfromBilling(paymentModel: MasterBillingPaymentModel): Promise<any> {

    return this.http.post('/Billing/AddUpdateVisitPaymentfromBilling',paymentModel);
  }

  AddUpdateAdmissionPaymentfromBilling(paymentModel: MasterBillingPaymentModel): Promise<any> {

    return this.http.post('/Billing/AddUpdateAdmissionPaymentfromBilling',paymentModel);
  }

  getBillingPaymentGridDetails(): Promise <any> {
    return this.http.get('/Billing/GetAllPaymentList').then(res => res);
  }

  GetVisitPaymentRecordbyID(visitPaymentId:any){
    return this.http.get('/Billing/GetVisitPaymentRecordbyID?visitPaymentId=' + visitPaymentId).then(res => res);
  }
  GetAdmissionPaymentRecordbyID(admissionPaymentID:any){
    return this.http.get('/Billing/GetAdmissionPaymentRecordbyID?admissionPaymentID=' + admissionPaymentID).then(res => res);
  }


  GetPaymentTypeListforBilling(){
    return this.http.get('/Billing/GetPaymentTypeListforBilling').then(res => res);
  }

  DeleteVisitPaymentRecord(visitPaymentId:any){
    return this.http.get('/Billing/DeleteVisitPaymentRecord?visitPaymentId=' + visitPaymentId).then(res => res);

  }

  DeleteAdmissionPaymentRecord(admissionPaymentId:any){
    return this.http.get('/Billing/DeleteAdmissionPaymentRecord?admissionPaymentId=' + admissionPaymentId).then(res => res);
  }


  //#region ReceiptNo AutoComplete
  getReceiptNo(searchKey: string): Promise<any> {
    return this.http.get('/Billing/GetReceiptNumbers?searchKey=' + searchKey).then(res => res);
  }
  //#endregion

  //#region Patient AutoComplete
  //getPatient(searchKey: string): Promise<any> {
  //  return this.http.get('/Billing/GetPatientsForBillingSearch?searchKey=' + searchKey).then(res => res);
  //}
  //#endregion
  searchAdmission(SearchModel: BillingPaymentRefundSearchModel): Promise<any> {
    return this.http.post('/Billing/GetAllPaymentParticularsforRefundbySearch', SearchModel).then(res => res);
  }
  //#region Billing Submit
  saveBillingPayment(refundPaymentCollection: BillingPaymentRefundModel): Promise<any> {
    return this.http.post('/Billing/UpdateRefundParticularDetails', refundPaymentCollection).then(res => res);
  }

  //#endregion

}
