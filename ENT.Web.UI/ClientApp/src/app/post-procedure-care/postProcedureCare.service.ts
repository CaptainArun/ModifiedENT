import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
import { PostprocedureCaseSheetModel } from './models/PostprocedureCaseSheetModel';
import { DrugchartModel } from '../../app/post-procedure-care/models/DrugchartModel';
import { PostSearchModel } from '../../app/post-procedure-care/models/postSearchModel';
import { SignoffModel } from '../post-procedure-care/models/signoffModel';

@Injectable({
  providedIn: 'root'
})

export class PostProcedureCareService {
  drugchartrecordid: any;
  constructor(private http: CustomHttpService) { }

  getGridTable(): Promise<any> {
    return this.http.get('/PostProcedure/GetPreProceduresforPostProcedure').then(res => res);
  }
  savepostprocedurecasesheet(model: PostprocedureCaseSheetModel): Promise<any> {
    return this.http.post('/PostProcedure/AddUpdatePostProcedureCaseSheetData', model).then(res => res);
  }
  //#region Postprocedure  get data
  getpostprocedurecasesheet(admissionId: number): Promise<any> {
    return this.http.get('/PostProcedure/GetPostProcedureCaseSheetbyAdmissionId?admissionId=' + admissionId).then(res => res);
  }
  getPostprocedureAdmission(admissionId: number): Promise<any> {
    /*    return this.http.get('/PreProcedure/GetPreProcedureAdmissionRecordbyId?admissionId=' + admissionId).then(res => res)
    */
    return this.http.get('/PostProcedure/GetAdmissionRecordbyId?admissionId=' + admissionId).then(res => res);
  }
  //Admission chart grid
  GetPostprocedureDrugchart(admissionNo: String): Promise<any> {
    return this.http.get('/PostProcedure/GetDrugChartListforPostProcedurebyAdmissionNumber?admissionNo=' + admissionNo).then(res => res);
  }
  GetProviderNames(facilityId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetProviderNamesforPreProcedure?facilityId=' + facilityId).then(res => res);
  }
  //Record During
  GetRecordDuring(): Promise<any> {
    return this.http.get('/PostProcedure/GetRecordedDuringOptionsforPostProcedure').then(res => res);
  }
  //Add
  addDrugchart(drugChartModel: DrugchartModel): Promise<any> {
    /*    return this.http.post('/PreProcedure/AddUpdateDrugChartData', drugChartModel);
    */
    return this.http.post('/PostProcedure/AddUpdateDrugChartDatafromPostProcedure', drugChartModel);
  }
  //Record By
  getRecordedBy(): Promise<any> {
    return this.http.get('/PostProcedure/GetProvidersforPostProcedure?searchKey=').then(res => res)
  }
  //Drug Autocomplete
  Getdrug(searchKey: string): Promise<any> {
    /*    return this.http.get('/PreProcedure/GetDrugCodes?searchKey=' + searchKey).then(res => res);
    */
    return this.http.get('/PostProcedure/GetDrugCodesforPostProcedureCasesheet?searchKey=' + searchKey).then(res => res);
  }
  //Route
  GetRoute(): Promise<any> {
    return this.http.get('/PostProcedure/GetMedicationRoutesforPostProcedure').then(res => res);
  }
  //Order Physician
  GetOrderingphysician(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetProvidersforPostProcedure?searchKey=' + searchKey).then(res => res);
  }
  //View
  getview(drugChartId: number): Promise<any> {
    /*    return this.http.get('/PreProcedure/GetDrugChartRecordbyId?drugChartId=' + drugChartId).then(res => res)
    */
    return this.http.get('/PostProcedure/GetDrugChartRecordfromPostProcedurebyId?drugChartId=' + drugChartId).then(res => res)
  }
  //Delete
  Deletedrugchart(drugChartId: number): Promise<any> {
    /*    return this.http.get('/PreProcedure/DeleteDrugChartRecordbyId?drugChartId=' + drugChartId).then(res => res);
    */
    return this.http.get('/PostProcedure/DeleteDrugChartRecordfromPostProcedurebyId?drugChartId=' + drugChartId).then(res => res);

  }
  //Edit
  Editdrugchart(drugChartId: number): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartRecordbyId?drugChartId=' + drugChartId).then(res => res)
  }

  //patient Condition
  getpatientcondition(): Promise<any> {
    return this.http.get('/PostProcedure/GetPatientArrivalConditionsforPostProcedure').then(res => res)
  }

  //Record By
  getpainlevel(): Promise<any> {
    return this.http.get('/PostProcedure/GetPainLevelsforPostProcedure').then(res => res)
  }
  // Admitting physician
  GetAdmittingphysician(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetProvidersforPostProcedure?searchKey=' + searchKey).then(res => res);
  }
  //procedure name
  Getprocedurename(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetProceduresforPostProcedure?searchKey=' + searchKey).then(res => res);
  }
  //CPT code
  Getcptcode(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetProcedureCodes?searchKey=' + searchKey).then(res => res);
  }
  //Total Count
  gettotalCount(): Promise<any> {
    return this.http.get('/PostProcedure/GetTodayPostProcedureCount').then(res => res);
  }
  //Speciality
  Getspeciality(): Promise<any> {
    return this.http.get('/PostProcedure/GetTenantSpecialitiesforPostProcedure').then(res => res);
  }

  //Search
  searchAdmission(searchModel: PostSearchModel): Promise<any> {
    return this.http.post('/PostProcedure/GetPreProceduresBySearch', searchModel).then(res => res);
  }
  //Doctor
  GetDoctor(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetProvidersforPostProcedureSearch?searchKey=' + searchKey).then(res => res);
  }
  //patient
  Getpatient(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetPatientsForPostProcedureSearch?searchKey=' + searchKey).then(res => res);
  }
  //Search
  signoff(searchModel: SignoffModel): Promise<any> {
    return this.http.post('/PostProcedure/SignoffUpdationforPostProcedureCare', searchModel).then(res => res);
  }

  getAdmissionDateAndTime(admissionId: number): Promise<any> {
    return this.http.get('/PostProcedure/GetAdmissionRecordbyId?admissionId=' + admissionId).then(res => res);
  }


  getProcedureRecordedDuring(): Promise<any> {
    return this.http.get('/PreProcedure/GetRecordedDuringOptionsforPreProcedure').then(res => res);
  }

  getAdministratedBy(searchKey: string): Promise<any> {
    return this.http.get('/PreProcedure/GetProvidersforPreProcedure?searchKey=' + searchKey).then(res => res);
  }



  getAdminDrugChart(admissionNo: string): Promise<any> {
    return this.http.get('/PreProcedure/GetDrugChartListforPreProcedurebyAdmissionNumber?admissionNo=' + admissionNo).then(res => res);
  }


  sendDrugAdministrationChartCollection(drugChartCollection: any): Promise<any> {
    return this.http.post('/PostProcedure/UpdateAdministrationDrugChartfromPostProcedure', drugChartCollection).then(res => res);
  }


  FileUploadMultiple(File: any, Id: number, screen: string): Promise<any> {
    return this.http.postfile('/PostProcedure/UploadFiles?Id=' + Id + '&screen=' + screen, File).then(res => res);
  }

  //Delete File

  //Delete
  DeleteFile(path: any, fileName: any): Promise<any> {
    return this.http.get('/PostProcedure/DeleteFile?path=' + path + '&fileName=' + fileName).then(res => res);
  }

  getFacility() {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }
  getAdmissionNumberBySearch(searchKey: string): Promise<any> {
    return this.http.get('/PostProcedure/GetAdmissionNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }
  /*  GetAdmission(): Promise<any> {
      return this.http.get('/PreProcedure/GetAdmissionDataforDrugChart').then(res => res);
    }
    GetAdmissionnn(admissionNo: string): Promise<any> {
      return this.http.get('/PreProcedure/GetDrugChartListforAdmissionNumber?admissionNo' + admissionNo).then(res => res);
    }
  
  
  
    
  
    Getpreplan(): Promise<any> {
      return this.http.get('/PostProcedure/GetDrugChartListforPostProcedure').then(res => res);
    }
  
  
  
  
    //preprocedure
    getPreProcedurePatient(admissionId: number): Promise<any> {
      return this.http.get('/PreProcedure/GetPreProcedurebyAdmissionId?admissionId=' + admissionId).then(res => res)
    }
  *//*  AddUpdatePreProcedure(preProcedureViewAnesthesiaModel: preProcedureViewAnesthesiaModel): Promise<any> {
      return this.http.post('/PreProcedure/AddUpdatePreProcedureData', preProcedureViewAnesthesiaModel);
    }*//*
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
*//*  addUpdateAnesthesiaFitness(AnesthesiafitnessModel: AnesthesiafitnessModel): Promise<any> {
      return this.http.post('/PreProcedure/AddUpdateAnesthesiaFitness', AnesthesiafitnessModel).then(res => res);
    }*//*
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
  }*/
}
