import { Injectable } from "@angular/core";
import { CustomHttpService } from '../core/custom-http.service';
// import { ASSRTestModel } from './models/assrTestModel';
// import { TuningForkTestModel } from './models/tuningForkTestModel';
// import { SpeechtherapySpecialtestsModel } from './models/speechtherapySpecialtestsModel';
// import { TympanometryModel } from './models/tympanometryModel';
// import { BERATestModel } from './models/beraTestModel';
// import { TinnitusmaskingModel } from './models/tinnitusmaskingModel';
// import { SpeechTherapyModel } from './models/speechTherapyModel';
// import { ElectrocochleographyModel } from './models/electrocochleographyModel';
// import { HearingAidTrialModel } from './models/hearingAidTrialModel';
// import { OAETestModel } from './models/oaeTestModel';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  // audiologyPatientDetails: any;
  
  constructor(private http: CustomHttpService) { }

  getCaseSheetDataForAudiology(): Promise<any> {
    return this.http.get('/Audiology/GetCaseSheetDataForAudiology').then(res => res);
  }

  GetAudiologyRecordsForAudiology(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetAudiologyRecords?VisitId=' + VisitId).then(res => res);
  }

  getTableDataForAudiology(): Promise<any> {
    return this.http.get('/Audiology/GetAllAudiologyRequests').then(res => res);
  }

  getPatientDetailsById(patientId: number): Promise<any> {
    return this.http.get('/Registeration/GetPatientDetailById?PatientId=' + patientId).then(res => res);
  }

  getRequestDataForAudiology(AudiologyRequestID: number): Promise<any> {
    return this.http.get('/Audiology/GetAudiologyRequestbyId?audiologyRequestID=' + AudiologyRequestID).then(res => res);
  }

  // addUpdateTuningForkTest(tuningForkTestModel: TuningForkTestModel):Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateTuningForkTest', tuningForkTestModel);
  // }

  // AddUpdateSpeechtherapySpecialtests(speechtherapySpecialModel: SpeechtherapySpecialtestsModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateSpeechtherapySpecialtests', speechtherapySpecialModel);
  // }

  // AddUpdateTympanometry(tympanometryModel: TympanometryModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateTympanometry', tympanometryModel);
  // }

  // AddUpdateOEATestData(oaeTestModel: OAETestModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateOEATestData', oaeTestModel);
  // }

  // AddUpdateBERATestData(beraTestModel: BERATestModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateBERATestData', beraTestModel);
  // }

  // AddUpdateASSRTestData(assrTestModel: ASSRTestModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateASSRTestData', assrTestModel);
  // }

  // AddUpdateHearingAidTrialData(hearingAidTrialModel: HearingAidTrialModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateHearingAidTrialData', hearingAidTrialModel);
  // }

  // AddUpdateTinnitusmaskingData(tinnitusmaskingModel: TinnitusmaskingModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateTinnitusmaskingData', tinnitusmaskingModel);
  // }

  // AddUpdateSpeechTherapyData(speechTherapyModel: SpeechTherapyModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateSpeechTherapyData', speechTherapyModel);
  // }

  // AddUpdateElectrocochleographyData(electrocochleographyModel: ElectrocochleographyModel): Promise<any> {
  //   return this.http.post('/Audiology/AddUpdateElectrocochleographyData', electrocochleographyModel);
  // }

  getTuningForkTestDataForPatientVisit(patientId: number, visitId: number, caseSheetId: number): Promise<any> {
    return this.http.get('/Audiology/GetTuningForkTestDataForPatientVisit?PatientID=' + patientId + '&VisitID=' + visitId + '&CaseSheetID=' + caseSheetId);
  }

  getSpeechTherapySpecialTestsForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetSpeechTherapySpecialTestsForPatientVisit?VisitID=' + visitId);
  }

  getTympanometryForPatientVisit(patientId: number, visitId: number, caseSheetId: number): Promise<any> {
    return this.http.get('/Audiology/GetTympanometryForPatientVisit?PatientID=' + patientId + '&VisitID=' + visitId + '&CaseSheetID=' + caseSheetId);
  }

  getOAETestForPatientVisit(visitId: number): Promise<any>{
    return this.http.get('/Audiology/GetOEATestForPatientVisit?VisitID=' + visitId);
  }

  getBERATestForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetBERATestForPatientVisit?VisitID=' + visitId);
  }

  getASSRTestForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetASSRTestForPatientVisit?VisitID=' + visitId);
  }

  getHearingAidTrialDataForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetHearingAidTrialDataForPatientVisit?VisitID=' + visitId);
  }

  getTinnitusmaskingDataForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetTinnitusmaskingDataForPatientVisit?VisitID=' + visitId);
  }

  getSpeechTherapyForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetSpeechTherapyForPatientVisit?VisitID=' + visitId);
  }

  getElectrocochleographyForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetElectrocochleographyForPatientVisit?VisitID=' + visitId);
  }
}
