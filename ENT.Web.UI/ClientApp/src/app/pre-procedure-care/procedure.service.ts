import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { DrugchartModel } from '../../app/pre-procedure-care/models/DrugchartModel';
import { preProcedureViewAnesthesiaModel } from "../pre-procedure-care/models/preProcedureViewAnesthesiaModel";
import { AnesthesiafitnessModel } from "../pre-procedure-care/models/AnesthesiafitnessModel";
import { searchModel } from "./models/searchModel";
import { ProcedureCareSignOffModel } from "./models/preProcedureCareSignOffModel";



@Injectable({
  providedIn: 'root'
})

export class ProcedureService {

  patientId: any;
  drugchartrecordid: any;
  constructor(private http: CustomHttpService) {

  }
  //('/PreProcedure/CancelPreProcedure?admissionId=' + admissionId + '&Reason=' + Reason)

  GetProviderNames(facilityId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetProviderNamesforPreProcedure?facilityId=' + facilityId).then(res => res);
  }

  GetPreprocedure(): Promise<any> {
    return this.http.get('/PreProcedure/GetRecordedDuringOptionsforPreProcedure').then(res => res);
  }

  GetAdmission(): Promise<any> {
    return this.http.get('/PreProcedure/GetAdmissionDataforDrugChart').then(res => res);
  }
  Getdrug(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugCodes?searchKey=' + searchKey).then(res => res);
  }
  GetOrderingphysician(): Promise<any> {
    return this.http.get('/PreProcedure/GetProviderListForPreProcedure').then(res => res);
  }
  addpreplan(drugChartModel: DrugchartModel): Promise<any> {
    return this.http.post('/PreProcedure/AddUpdateDrugChartData', drugChartModel);
  }

  Getpreplan(): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartListforPreProcedure').then(res => res);
  }
  Getpreplan1(admissionNo: String): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartListforPreProcedurebyAdmissionNumber?admissionNo=' + admissionNo).then(res => res);
  }
  Deletepreplan(drugChartId: number): Promise<any> {
    return this.http.get('/PreProcedure/DeleteDrugChartRecordbyId?drugChartId=' + drugChartId).then(res => res);
  }


  getprocedurebyId(drugChartId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartRecordbyId?drugChartId=' + drugChartId).then(res => res)
  }
  //preprocedure
  getPreProcedurePatient(admissionId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetPreProcedurebyAdmissionId?admissionId=' + admissionId).then(res => res)
  }

  getPreProcedureAdmission(admissionId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetPreProcedureAdmissionRecordbyId?admissionId=' + admissionId).then(res => res)
  }

  AddUpdatePreProcedure(preProcedureViewAnesthesiaModel: preProcedureViewAnesthesiaModel): Promise<any> {
    return this.http.post('/PreProcedure/AddUpdatePreProcedureData', preProcedureViewAnesthesiaModel);
  }
  //from ot

  getSurgertRequestForPreSurgicalCare(): Promise<any> {
    return this.http.get('/PreSurgical/GetSurgeryRequestForPreSurgicalCare').then(res => res);
  }

  getSurgeryRequestbyID(requestId: number): Promise<any> {
    return this.http.get('/PreSurgical/GetSurgeryRequestbyID?RequestID' + requestId).then(res => res);
  }

  updateSurgeryRequest(requestId: number, requestDate: Date, requestTime: string) {
    return this.http.post('/PreSurgical/UpdateSurgeryRequest?RequestID=' + requestId + '&RequestDate=' + requestDate + '&RequestTime=' + requestTime);
  }
  getAllPatientVisits(): Promise<any> {
    return this.http.get('/PreProcedure/GetAllAdmissionsforPreProcedure').then(res => res);

  }
  addUpdateAnesthesiaFitness(AnesthesiafitnessModel: AnesthesiafitnessModel): Promise<any> {
    return this.http.post('/PreProcedure/AddUpdateAnesthesiaFitness', AnesthesiafitnessModel).then(res => res);
  }
  getAllAnethesiaFitnessList(): Promise<any> {
    return this.http.get('/PreProcedure/GetAnesthesiafitnessList').then(res => res);
  }
  getAnesthesiaFitnessDetails(patientId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetAnesthesiafitnessListforPatient?patientId' + patientId).then(res => res);
  }
  getAnesthesialist(AnesthesiafitnessId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetAnesthesiafitnessRecordbyID?AnesthesiafitnessId' + AnesthesiafitnessId).then(res => res);
  }
  getAnesthesiapatient(admissionID: number): Promise<any> {
    return this.http.get('/PreProcedure/GetAnesthesiafitnessRecordbyAdmissionID?admissionID=' + admissionID).then(res => res);
  }
  getAdmissionDateAndTime(admissionId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetPreProcedureAdmissionRecordbyId?admissionId=' + admissionId).then(res => res);
  }
  getProcedureRecordedDuring(): Promise<any> {
    return this.http.get('/PreProcedure/GetRecordedDuringOptionsforPreProcedure').then(res => res);
  }
  getAdministratedBy(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetProvidersforPreProcedure?searchKey=' + searchKey).then(res => res);
  }
  getOrderPhysician(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetProvidersforPreProcedure?searchKey=' + searchKey).then(res => res);
  }
  getAdminDrugChart(admissionNo: string): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartListforPreProcedurebyAdmissionNumber?admissionNo=' + admissionNo).then(res => res);
  }
  getRouteData(): Promise<any> {
    return this.http.get('/PreProcedure/GetMedicationRoutesforPreProcedure').then(res => res);
  }

  getTotalCount(): Promise<any> {
    return this.http.get('/PreProcedure/GetTodayPreProcedureCount').then(res => res);
  }
  Getspecialities(): Promise<any> {
    return this.http.get('/PreProcedure/GetTenantSpecialitiesforPreProcedure').then(res => res);
  }
  getPatientName(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetPatientsForPreProcedureSearch?searchKey=' + searchKey).then(res => res);
  }
  getPhysicianName(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetProvidersforPreProcedureSearch?searchKey=' + searchKey).then(res => res);
  }
  searchPreProcedure(searchModel: searchModel): Promise<any> {
    return this.http.post('/PreProcedure/GetAdmissionsBySearch', searchModel).then(res => res);
  }
  sendDrugAdministrationChartCollection(drugChartCollection: any): Promise<any> {
    return this.http.post('/PreProcedure/UpdateAdministrationDrugChart', drugChartCollection).then(res => res);
  }
  sendCancelPreProcedure(admissionId: number, Reason: string): Promise<any> {
    return this.http.get('/PreProcedure/CancelPreProcedure?admissionId=' + admissionId + '&Reason=' + Reason).then(res => res);
  }
  sendSignOffModel(ProcedureCareSignOffModel: ProcedureCareSignOffModel): Promise<any> {
    return this.http.post('/PreProcedure/SignoffUpdationforPreProcedureCare', ProcedureCareSignOffModel).then(res => res);
  }
  getFacility() {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
  getAdmissionNumberBySearch(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetAdmissionNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }

  UserVerification(UserName: string, Password: string): Promise<any> {
    return this.http.get('/PreProcedure/UserVerification?UserName=' + UserName + '&Password=' + Password).then(res => res);
  }
}
