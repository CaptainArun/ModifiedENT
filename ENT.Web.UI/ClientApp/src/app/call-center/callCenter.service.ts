import { Injectable } from "@angular/core";
import { CallCenterModel } from './models/callCenterModel';
import { AppointmentSearchModel } from '../appointments/models/appointmentSearchModel';
import { CustomHttpService } from '../core/custom-http.service';
import { CallCenterOtSearchModel, CallCenterSearchModel } from "./models/callCenterSearchModel";
import { AppointmentModel } from "../appointments/models/appointmentModel";

@Injectable({
  providedIn: 'root'
})
export class CallCenterService {

  constructor(private http: CustomHttpService) { }

  getAppointmentCountForCallCenter(): Promise<any> {
    return this.http.get('/CallCenter/GetCallCenterCount').then(res => res);
  }

  getSpecialityForCallCenter(): Promise<any> {
    return this.http.get('/CallCenter/GetSpecialitiesForCallCenter').then(res => res);
  }

 
  getAllCallCenterData(): Promise<any> {
    return this.http.get('/CallCenter/GetAllCallCenterData').then(res => res);
  }

 

 

  // New ...

  getProvidersforCallCenter(searchkey: string): Promise<any> {
    return this.http.get('/CallCenter/GetProvidersforCallCenter?searchKey=' + searchkey).then(res => res);
  }


  getAllPatientforCallCenter(searchkey: string): Promise<any> {
    return this.http.get('/CallCenter/GetPatientsForCallCenter?searchKey=' + searchkey).then(res => res);
  }

  getSearchCallCenterData(searchModel: CallCenterSearchModel): Promise<any> {
    return this.http.post('/CallCenter/SearchCallCenterAppointments', searchModel).then(res => res);
  }

  getAppointmentCallCenterCount(): Promise<any> {
    return this.http.get('/CallCenter/GetCallCenterCount').then(res => res);
  }

  getProcedureSurgeryCallCenterCount(): Promise<any> {
    return this.http.get('/CallCenter/GetRequestCountsforCallCenter').then(res => res);
  }
  getCallCenterAppointmentById(appointmentId): Promise<any> {
    return this.http.get('/CallCenter/GetCallCenterDataByAppointmentId?appointmentId=' + appointmentId);
  }

  getCallCenterProcedureRequestId(procedureRequestId): Promise<any> {
    return this.http.get('/CallCenter/GetCallCenterDataByProcedureRequestId?procedureRequestId=' + procedureRequestId);
  }
  //
  getAppointmentStatusForCallCenter(): Promise<any> {
    return this.http.get('/CallCenter/GetAppointmentStatusesforCallCenter').then(res => res);
  }
  
  addUpdateCallCenterData(callCenterModel: CallCenterModel): Promise<any> {
    return this.http.post('/CallCenter/AddUpdateCallCenterData', callCenterModel);
  }

  getCCAppointmentReschuduleById(appointmentId): Promise<any> {
    return this.http.get('/CallCenter/GetAppointmentfromCallCenterbyID?appointmentId=' + appointmentId);
  }


  addAppointmentReschudule(appointmentModel: AppointmentModel): Promise<any> {
    return this.http.post('/CallCenter/UpdateAppointmentfromCallCenter', appointmentModel);
  }

  getCCAppointmentHistoryById(PatientId): Promise<any> {
    return this.http.get('/CallCenter/GetPreviousAppointmentHistoryForPatient?PatientId=' + PatientId);
  }


  getCCParticularHistoryCountData(PatientId): Promise<any> {
    return this.http.get('/CallCenter/GetAppointmentCountsforPatient?PatientId=' + PatientId);
  }

  SearchProcedureRequestsforCallCenter(CallCenterSearchModel: CallCenterOtSearchModel): Promise<any> {
    return this.http.post('/CallCenter/SearchProcedureRequestsforCallCenter', CallCenterSearchModel);
  }


  getAppointmentNumberBySearch(searchkey: string): Promise<any> {
    return this.http.get('/CallCenter/GetAppointmentNumbersbySearch?searchkey='+searchkey ).then(res => res);
  }

  getFacilitiesByuser(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

  getVisitNumberBySearch(searchkey: string): Promise<any> {
    return this.http.get('/CallCenter/GetVisitNumbersbySearch?searchkey='+searchkey).then(res => res);
  }

}
