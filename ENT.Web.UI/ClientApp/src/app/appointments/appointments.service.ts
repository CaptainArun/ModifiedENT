import { Injectable } from "@angular/core";
import { AppointmentModel } from './models/appointmentModel';
import { AppointmentSearchModel } from './models/appointmentSearchModel';
import { CustomHttpService } from '../core/custom-http.service';
import { AvailabilityModel } from './models/availabilityModel';

@Injectable({
  providedIn: 'root'
})

export class AppointmentsService {
  constructor(private http: CustomHttpService) { }

  getAllAppointmentStatus(): Promise<any> {
    return this.http.get('/Appointment/GetAllAppointmentStatuses').then(res => res);
  }

  getAllAppointmentType(): Promise<any> {
    return this.http.get('/Appointment/GetAllAppointmentTypes').then(res => res);
  }

  getFacilitiesforAppointment(): Promise<any> {
    return this.http.get('/Appointment/GetFacilitiesforAppointment').then(res => res);
  }

  getProvidersforAppointments(): Promise<any> {
    return this.http.get('/Appointment/GetProvidersforAppointment').then(res => res);
  }

  getProvidersforAppointment(searchkey: string): Promise<any> {
    return this.http.get('/Appointment/GetProvidersforAppointmentSearch?searchKey=' + searchkey).then(res => res);
  }
  getAllPatient(searchkey: string): Promise<any> {
    return this.http.get('/Appointment/GetPatientsForAppointmentSearch?searchKey=' + searchkey).then(res => res);
  }
  //GetPatientsForAppointmentSearch
  //GetProvidersforAppointmentSearch
  getProviderSpecialities(): Promise<any> {
    return this.http.get('/Appointment/GetProviderSpecialities')
  }
  getProvidSpecialities(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAllSpecialities')
  }

  getTreatmentCodes(searchKey: string): Promise<any> {
    return this.http.get('/Appointment/GetTreatmentCodes?searchKey=' + searchKey).then(res => res);
  }

  getAppointmentList(): Promise<any> {
    return this.http.get('/Appointment/GetToDayAppointments').then(res => res);
  }


  addAppointment(appointmentModel: AppointmentModel): Promise<any> {
    return this.http.post('/Appointment/AddUpdateAppointment', appointmentModel);
  }

  getPatientAppointmentById(appointmentId): Promise<any> {
    return this.http.get('/Appointment/GetAppointmentById?AppointmentId=' + appointmentId);
  }

  getTodayAppointmentCount(): Promise<any> {
    return this.http.get('/Appointment/TodayAppointmentCounts').then(res => res);
  }

  getPatientAppointmentHisById(patientId): Promise<any> {
    return this.http.get('/Appointment/GetAppointmentHistoryForPatient?PatientId=' + patientId);
  }

  appointmentSearch(searchModel: AppointmentSearchModel): Promise<any> {
    return this.http.post('/Appointment/SearchAppointments', searchModel);
  }

  deleteAppointmentById(appointmentId: number): Promise<any> {
    return this.http.get('/Appointment/DeleteOrCancelAppointment?AppointmentId=' + appointmentId);
  }

  availabilityStatus(availabilityModel: AvailabilityModel): Promise<any> {
    return this.http.post('/Appointment/AvailabilityStatus', availabilityModel).then(res => res);
  }

  getTimingsforAppointment(AppointDate: string, ProviderID: number, facilityID: number): Promise<any> {
    return this.http.get('/Appointment/GetTimingsforAppointment?AppointDate=' + AppointDate + '&ProviderID=' + ProviderID + '&facilityID=' + facilityID).then(res => res);
  }

  getDatesForProvider(providerId: number) {
    return this.http.get('/Appointment/GetDatesForProvider?ProviderId=' + providerId);
  }

  totalAppointmentCount(): Promise<any> {
    return this.http.get('/Appointment/TodayAppointmentCounts').then(res => res);
  }

  searchAppointment(searchModel: AppointmentSearchModel): Promise<any> {
    return this.http.post('/Appointment/SearchAppointments', searchModel).then(res => res);
  }
  getProvidersbyfacilityId(faciltyId: number): Promise<any> {
    return this.http.get('/Appointment/GetProvidersbyFacility?facilityID=' + faciltyId).then(res => res);
  }
  getPatientsBySearch(searchKey: string): Promise<any> {
    return this.http.get('/Registeration/GetPatientsBySearch?Searchkey=' + searchKey).then(res => res);
  }
  getCalenederData(viewMode: any, date: any) {
    return this.http.get('/Appointment/GetAppointmentsForCalendar?viewMode=' + viewMode + '&date=' + date).then(res => res);
  }
  getFacilitiesByuser(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
  getAppointmentNumberBySearch(searchKey: string): Promise<any> {
    return this.http.get('/Appointment/GetAppointmentNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }
  //get Appointment Number Auto Generate
  getAppointmentNo(): Promise<any> {
    return this.http.get('/Appointment/GetAppointmentNumber').then(res => res);
  }

  // fetchApiData() : Promise<any>
  // {
  //   return this.http.get('/Appointment/GetAppointmentNumber').then(res => res);
  // }
}
