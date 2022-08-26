import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { RegistrationModel } from './models/registration.model'

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  constructor(private http: CustomHttpService) { }

  //facilityData(): Promise<any> {
  //  return this.http.get('/DRApi/GetFacilities').then(res => res);
  //}

  //roleData(): Promise<any> {
  //  return this.http.get('/DRApi/GetDRRoles').then(res => res);
  //}

  //async registrationDetails(registrationModel: RegistrationModel): Promise<any> {
  //  return this.http.post('/DRApi/AddUsers', registrationModel);
  //}
}
