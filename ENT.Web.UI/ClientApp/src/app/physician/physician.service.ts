import { Injectable } from "@angular/core";
import { PhysicianModel } from './models/physicianModel';
import { PhysicianSpecialityModel } from './models/physicianSpecialityModel';
import { PhysicianScheduleModel } from './models/physicianScheduleModel';
import { PhysicianVacationModel } from './models/physicianVacationModel';
import { CustomHttpService } from '../core/custom-http.service';
import { PhysicianAddressModel } from './models/physicianAddressModel';
import { PhysicianDiagnosisCodeModel } from './models/physicianDiagnosisCodeModel';
import { PhysicianProcedureCodeModel } from './models/physicianProcedureCodeModel';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PhysicianService {
  constructor(private http: CustomHttpService) { }
  public stringSubject = new Subject<string>();

  getPhysicianCount(): Promise<any> {
    return this.http.get('/ProviderSetUp/ProviderCount').then(res => res);
  }
  
  getAllPhysicianList(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAllProviders').then(res => res);
  }

  addUpdatePhysician(physicianModel: PhysicianModel): Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateProvider', physicianModel);
  }

  getPhysicianById(providerId: number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetProviderById?ProviderId=' + providerId).then(res=>res);
  }

  addUpdateProviderAddresses(physicianAddress: PhysicianAddressModel): Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateProviderAddresses', physicianAddress);
  }

  addUpdatePhysicianSpeciality(physicianSpecialityModel: PhysicianSpecialityModel): Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateProviderSpeciality', physicianSpecialityModel);
  }

  addUpdatePhysicianSchedules(physicianScheduleModel: PhysicianScheduleModel): Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateSchedules', physicianScheduleModel);
  }

  getPhysicianSpecialities(providerId: number):Promise<any> {
    return this.http.get('/ProviderSetUp/GetProviderSpecialities?ProviderId=' + providerId).then(res => res);
  }

  getPhysicianSpecialitybyID(providerSpecialityId: number):Promise<any> {
    return this.http.get('/ProviderSetUp/GetProviderSpecialityByID?ProvSpecialityId=' + providerSpecialityId).then(res => res);
  }

  getPhysicianVacationDetails(providerId: number):Promise<any> {
    return this.http.get('/ProviderSetUp/GetProviderVacationDetails?ProviderId=' + providerId).then(res => res);
  }

  addUpdatePhysicianVacation(vacationModel: PhysicianVacationModel):Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateVacationDetails', vacationModel);
  }

  addUpdateDiagnosisCodes(diagnosisData: PhysicianDiagnosisCodeModel[]): Promise<any> {

    return this.http.post('/ProviderSetUp/AddUpdateDiagnosisCodes', diagnosisData).then(res => res);
  }
 
  addUpdateProcedureCodes(procedureData: PhysicianProcedureCodeModel[]): Promise<any> {
    return this.http.post('/ProviderSetUp/AddUpdateCPTCodes', procedureData);
  }

  getAllSpecialities(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAllSpecialities').then(res => res);
  }

  getAllDiagnosisCodes(searchKey:string, providerId:number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAllDiagnosisCodes?searchKey=' + searchKey + '&ProviderID=' + providerId).then(res => res);
  }

  getAllTreatmentCodes(searchKey: string, providerId: number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAllTreatmentCodes?searchKey=' + searchKey + '&ProviderID=' + providerId).then(res => res); 
  }

  SearchPhysicianList(providerId: number, specialityId: number): Promise<any> {
    return this.http.get('/ProviderSetUp/SearchProvider?ProviderId=' + providerId + '&SpecialityId=' + specialityId);
  }

  getScheduleSetup(ProviderId: number, facilityID: number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetProviderScheduleDetails?ProviderId=' + ProviderId + '&facilityID=' + facilityID);
  }


  getICDCodesforProvider(searchKey:string, providerID: number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetICDCodesforProvider?ProviderId=' + providerID + '&searchKey=' + searchKey).then(res=>res);
  }

  getCPTCodesforProvider(searchKey: string,providerID: number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetCPTCodesforProvider?searchKey=' + searchKey +'&ProviderId=' + providerID).then(res=>res);
  }
  //#region "gender"
  getGenderforPhysician(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetGenderListforProvider').then(res => res);
  }
   //#endregion

  //#region "Address"
  getAddressforPhysician(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetAddressTypeListforProvider').then(res => res);
  }
     //#endregion

  //#region "Country"
  getCountryforPhysician(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetCountryListforProvider').then(res => res);
  }
     //#endregion

  //#region "State"
  getStateforPhysician(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetStateListforProvider').then(res => res);
  }
     //#endregion
   //#region "language"
  getLanguageforPhysician(): Promise<any> {
    return this.http.get('/ProviderSetUp/GetLanguageListforProvider').then(res => res);
  }

  //#endregion


   //#region "Role"
  getRole(): Promise<any> {
    return this.http.get('/TenantMaster/GetRolesList').then(res => res);
  }
    //#endregion


  //#region "Facility"
  getFacility(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
    //#endregion

  FileUpload(File: FormData, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/ProviderSetUp/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }

  // Facility Dropdown
  getFacilitiesforPhysician(providerId:number): Promise<any> {
    return this.http.get('/ProviderSetUp/GetFacilitiesbyProviderId?providerId=' + providerId).then(res => res);
  }
  //#region "Facility Dropdown"
  getAllFacility(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllFacilities').then(res => res);
  }
    //#endregion
}
