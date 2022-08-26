import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { clsFile } from "./models/clsFile";
import { orderRequestModel } from "./models/eLabOrderRequestModel";
import { labSetupModel } from "./Models/eLabSetupModel";
import { LabMasterModel } from "./Models/LabMasterModel";
import { LabSubMasterModel } from "./Models/labSubMasterModel";
import { ElabSearchModel } from "./models/searchModelELab";
import { eLabOrderStatusModel } from "./models/updateReportModel";

@Injectable({
  providedIn: 'root'
})

export class eLabService {

  constructor(private http: CustomHttpService) { }

  //lab master
  GetDepartmentLabCodeList(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetDepartmentListforELab?searchKey=' + searchKey).then(res => res);
  }
  SaveAddElabMaster(LabMasterModel: LabMasterModel): Promise<any> {
    return this.http.post('/ELab/AddUpdateELabMasterData', LabMasterModel).then(res => res);
  }
  getBillingLabMasterList(): Promise<any> {
    return this.http.get('/ELab/GetELabMasterList').then(res => res);
  }
  getLabMasterById(eLabMasterId: number): Promise<any> {
    return this.http.get('/ELab/GetELabMasterRecord?eLabMasterId=' + eLabMasterId).then(res => res);
  }
  DeleteRecordofMasterLab(eLabMasterId: number): Promise<any> {
    return this.http.get('/ELab/DeleteELabMasterRecord?eLabMasterId=' + eLabMasterId).then(res => res);
  }
  GetLabSubMasterList(): Promise<any> {
    return this.http.get('/ELab/GetELabMasterList').then(res => res);
  }
  sendSubLabMaster(LabSubMasterModel: LabSubMasterModel): Promise<any> {
    return this.http.post('/ELab/AddUpdateELabSubMasterData', LabSubMasterModel).then(res => res);
  }
  GetDepartmentCodeList(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetDepartmentsfromMasterforELab?searchKey=' + searchKey).then(res => res);
  }
  GetTestNameList(departmentID: number, searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetSubMasterallowedELabTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res);
  }
  GetStatusValue(): Promise<any> {
    return this.http.get('/ELab/GetStatusesforELab').then(res => res);
  }
  GetLabSubMasterListGrid(): Promise<any> {
    return this.http.get('/ELab/GetELabSubMasterList').then(res => res);
  }
  getIndiviualRecordById(eLabSubMasterId: number): Promise<any> {
    return this.http.get('/ELab/GetELabSubMasterRecord?eLabSubMasterId=' + eLabSubMasterId).then(res => res);
  }
  DeleteRecordSubMaster(eLabSubMasterId: number): Promise<any> {
    return this.http.get('/ELab/DeleteELabSubMasterRecord?eLabSubMasterId=' + eLabSubMasterId).then(res => res);
  }
  GetAllSetupMasterData(): Promise<any> {
    return this.http.get('/ELab/GetELabSetupMasterList').then(res => res);
  }
  AddUpdateBillingSetupMasterData(labSetupModel: labSetupModel): Promise<any> {
    return this.http.post('/ELab/AddUpdateELabSetupMasterData', labSetupModel).then(res => res);
  }
  DeleteRecordSetupMaster(eLabSetupMasterId: number): Promise<any> {
    return this.http.get('/ELab/DeleteELabSetupMasterRecord?eLabSetupMasterId=' + eLabSetupMasterId).then(res => res);
  }
  getOneRecordOfSetup(eLabSetupMasterId: number): Promise<any> {
    return this.http.get('/ELab/GetELabSetupMasterRecordbyID?eLabSetupMasterId=' + eLabSetupMasterId).then(res => res);
  }
  GetPatientCard(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetPatientsForELab?searchKey=' + searchKey).then(res => res);
  }
  getPatientVisitDateTime(PatientId: number): Promise<any> {
    return this.http.get('/ELab/GetVisitsbyPatientforELab?PatientId=' + PatientId).then(res => res);
  }// 
  GetProviderName(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetProvidersforELab?searchKey=' + searchKey).then(res => res);
  }
  SaveOrderRequest(orderRequestModel: orderRequestModel): Promise<any> {
    return this.http.post('/ELab/AddUpdateELabOrder', orderRequestModel).then(res => res);
  }
  getUrgencyValue(): Promise<any> {
    return this.http.get('/ELab/GetUrgencyTypesforELab').then(res => res);
  }
  getOrderNumber(): Promise<any> {
    return this.http.get('/ELab/GetLabOrderNumber').then(res => res);
  }
  MasterSearchGrid(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  SubMasterSearchGrid(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabSubMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  setupSearchGrid(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabSetupMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  GetTestName(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  GetTestNameSub(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabSubMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  getTestName(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetELabSetupMasterListbySearch?searchKey=' + searchKey).then(res => res);
  }
  getTableDataRequest(): Promise<any> {
    return this.http.get('/ELab/GetAllELabRequests').then(res => res);
  }
  getOneRecordOfOrder(LabOrderId: number): Promise<any> {
    return this.http.get('/ELab/GetELabOrderbyID?LabOrderId=' + LabOrderId).then(res => res);
  }
  getViewRecordByOrder(orderNo: any): Promise<any> {
    return this.http.get('/ELab/GetELabOrderforOrderNo?orderNo=' + orderNo).then(res => res);
  }
  confirmRequestForOrder(labRequestId: number): Promise<any> {
    return this.http.get('/ELab/ConfirmRequest?labRequestId=' + labRequestId).then(res => res);
  }
  getViewRecordByLabRequestID(labRequestId: number): Promise<any> {
    return this.http.get('/ELab/GetELabRequestbyId?labRequestId=' + labRequestId).then(res => res);
  }
  getCountDetails(): Promise<any> {
    return this.http.get('/ELab/GetELabCounts').then(res => res);
  }
  getStatusValue(): Promise<any> {
    return this.http.get('/ELab/GetLabOrderStatuses').then(res => res);
  }
  GetPatientRecord(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetPatientsForELab?searchKey=' + searchKey).then(res => res);
  }
  getProviderRecord(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetProvidersforELab?searchKey=' + searchKey).then(res => res);
  }
  getLabOrderNumbers(searchKey: any): Promise<any> {
    return this.http.get('/ELab/GetLabOrderNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }
  getLabOrderGridData(searchModel: ElabSearchModel): Promise<any> {
    return this.http.post('/ELab/GetELabOrdersbySearch', searchModel).then(res => res);
  }

  getUpdateReportRecordByLabOrderID(labOrderId: number): Promise<any> {
    return this.http.get('/ELab/GetELabOrderbyID?labOrderId=' + labOrderId).then(res => res);
  }

  SaveUpdateReport(eLabOrderStatusModel: eLabOrderStatusModel): Promise<any> {
    return this.http.post('/ELab/AddUpdateELabOrderStatusReport', eLabOrderStatusModel).then(res => res);
  }

  FileUploadMultiple(Files: any, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/ELab/UploadFiles?Id=' + Id + '&screen=' + screen, Files).then(res => res);
  }

  deleteFile(path: string, fileName: string): Promise<any> {
    return this.http.get('/ELab/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }

  SignOffUpdateReport(Username: string, Password: string, labOrderStatusId: number): Promise<any> {
    return this.http.get('/ELab/LabOrderStatusReportSignOff?Username=' + Username + '&Password=' + Password + '&labOrderStatusId=' + labOrderStatusId).then(res => res);
  }

  CancelRequest(labRequestId: number): Promise<any> {
    return this.http.get('/ELab/CancelELabRequest?labRequestId=' + labRequestId).then(res => res);
  }

  UserNameVerification(userName: string, Password: string): Promise<any> {
    return this.http.get('/ELab/UserVerification?userName=' + userName + '&Password=' + Password).then(res => res);
  }
  DeleteOrderRecordById(LabOrderID: number): Promise<any> {
    return this.http.get('/ELab/DeleteLabOrderbyId?labOrderId=' + LabOrderID).then(res => res);
  }
  sendMailBylabOrderId(eMailId: string, labOrderId: string): Promise<any> {
    return this.http.get('/ELab/SendMail?eMailId=' + eMailId + '&labOrderId=' + labOrderId).then(res => res);
  }
}