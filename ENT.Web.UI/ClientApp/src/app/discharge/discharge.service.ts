import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { DischargeModel } from "./models/DischargeModel";
import { DischargeSearchModel } from "./models/dischargeSearchModel";
import { SignOffModel } from "./models/signOffModel";

@Injectable({
  providedIn: 'root'
})

export class DischargeService {

  constructor(private http: CustomHttpService) { }

  getDischargeRecords(): Promise<any> {
    return this.http.get('/Discharge/GetDischargeRecords').then(res => res);
  }

  getProviderforDischarge(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetProvidersforDischarge?searchKey=' + searchKey).then(res => res);
  }

  getPatientforDischarge(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetPatientsForDischarge?searchKey=' + searchKey).then(res => res);
  }

  getDischargeSummaryRecord(admissionID: number): Promise<any> {
    return this.http.get('/Discharge/GetDischargeRecordbyAdmissionID?admissionID=' + admissionID).then(res => res);
  }

  addUpdateDischargeData(dischargeModel: DischargeModel): Promise<any> {
    return this.http.post('/Discharge/AddUpdateDischargeSummaryRecord' , dischargeModel);
  }

  dischargeSearch(searchModel: DischargeSearchModel): Promise<any> {
    return this.http.post('/Discharge/GetDischargeRecordsbySearch', searchModel);
  }

  getDischargeCount(): Promise<any> {
    return this.http.get('/Discharge/GetDischargeCounts').then(res => res);
  }

  getAdmissionNumberForSearch(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetAdmissionNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }

  getFacilityNames(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

  // Medication
  getDrugNameforDischarge(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetDrugCodesforDischarge?searchKey=' + searchKey).then(res => res);
  }

  getMedicationRouteforDischarge(): Promise<any> {
    return this.http.get('/Discharge/GetMedicationRoutesforDischarge').then(res => res);
  }

  getDiagnosisCodeforDischarge(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetDiagnosisCodesforDischarge?searchKey=' + searchKey).then(res => res);
  }

  // Lab order
  getTestNameforDischarge(searchKey: string): Promise<any> {
    return this.http.get('/Discharge/GetELabSetupMastersbySearchfromDischarge?searchKey=' + searchKey).then(res => res);
  }

  getUrgencyTypeforDischarge(): Promise<any> {
    return this.http.get('/Discharge/GetUrgencyTypesforDischarge').then(res => res);
  }

  // Signoff
  signOff(signOff: SignOffModel): Promise<any> {
    return this.http.post('/Discharge/SignoffUpdationforDischarge', signOff).then(res => res);
  }

  // File Upload
  FileUpload(File: FormData, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/Discharge/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }

  // Remove Uploaded files from Discharge
  RemoveFile(path: string, fileName: string): Promise<any> {
    return this.http.get('/Discharge/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }

}
