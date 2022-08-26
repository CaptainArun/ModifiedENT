import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { StaffProfileModel } from '../staff/models/staffProfileModel'
 

@Injectable({
  providedIn: 'root'
})

export class StaffService {
  constructor(private http: CustomHttpService) { }

  //#region "Facility"
  getFacility(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
   //#endregion

   //#region "Role"
  getRoleForStaff(): Promise<any> {
    return this.http.get('/Staff/GetRoles').then(res => res);
  }
    //#endregion

  //#region "salutation"
  getSalutation(): Promise<any> {
    return this.http.get('/Staff/GetSalutationList').then(res => res);
  }
  //#endregion

 //#region "Gender"
  getGender(): Promise<any> {
    return this.http.get('/Staff/GetGenderList').then(res => res);
  }
 //#endregion

//#region "Identification"
  getIdentification(): Promise<any> {
    return this.http.get('/Staff/GetIdentificationTypeList').then(res => res);
  }
   //#endregion

  //#region "Martaial status"
  getMaritalStatus(): Promise<any> {
    return this.http.get('/Staff/GetAllMaritalStatuses').then(res => res);
  }
     //#endregion

  //#region "Blood Group"
  getBloodGroup(): Promise<any> {
    return this.http.get('/Staff/GetBloodGroupList').then(res => res);
  }
   //#endregion

  //#region "Language"
  getLanguage(): Promise<any> {
    return this.http.get('/Staff/GetLanguageList').then(res => res);
  }
     //#endregion

    //#region "Address Type"
  getAddressType(): Promise<any> {
    return this.http.get('/Staff/GetAddressTypeList').then(res => res);
  }
  //#endregion
  //#region "Relation"
  getRelation(): Promise<any> {
    return this.http.get('/Staff/GetAllRelations').then(res => res);
  }
  //#endregion

  //#region "CellNo"
  getContactType(): Promise<any> {
    return this.http.get('/Staff/GetContactTypeList').then(res => res);
  }
  //#endregion

  //#region "ExtracurricularActivitiesType"
  getExtracurricularActivitiesType(): Promise<any> {
    return this.http.get('/Staff/GetEmpExtracurricularActivitiesType').then(res => res);
  }
  //#endregion

  //#region "User Type"
  getUserType(): Promise<any> {
    return this.http.get('/Staff/GetUserType').then(res => res);
  }
  //#endregion

//#region "Department"
  getDepartment(searchKey:string): Promise <any> {
  return this.http.get('/Staff/GetDepartmentsForSearch?searchKey=' + searchKey).then(res => res);
}
 //#endregion

  //#region "Langauge"
  getPreferedLanguage(searchKey: string): Promise<any>{
    return this.http.get('/Staff/GetLanguagesForSearch?searchKey=' + searchKey).then(res => res);
  }
  //#endregion
  //#region "Langauge"
  addStaff(staffProfileModel: StaffProfileModel): Promise<any> {
    return this.http.post('/Staff/AddUpdateStaffRecord', staffProfileModel).then(res => res);
  }


  //#region "Get Staff"
  getStaff(): Promise<any> {
    return this.http.get('/Staff/GetStaffs').then(res => res);
  }
  //#endregion

  //#region "Get Staff Employee"
  getStaffEmployeeNo(): Promise<any> {
    return this.http.get('/Staff/GetEmployeeNumber').then(res => res);
  }
  //#endregion
  GetEmployeeByID(employeeId: number): Promise<any> {
    return this.http.get('/Staff/GetStaffbyId?employeeId=' + employeeId).then(res => res);
  }

  FileUpload(file: FormData, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/Staff/UploadFiles?Id=' + Id + '&screen=' + screen, file).then(res => res);
  }

  //#region "Get Staff Image Card"
  getStaffImageCard(employeeId: number): Promise<any> {
    return this.http.get('/Staff/GetStaffbyId?employeeId=' + employeeId).then(res => res);
  }
   //#endregion


}
