import { Injectable } from '@angular/core';
import { CustomHttpService } from '../core/custom-http.service';
import { ASSRTestModel } from './model/assrTestModel';
import { AudiologySearchModel } from './model/audiologySearchModel';
import { BERATestModel } from './model/beraTestModel';
import { ElectrocochleographyModel } from './model/electrocochleographyModel';
import { HearingAidTrialModel } from './model/hearingAidTrialModel';
import { OAETestModel } from './model/oaeTestModel';
import { signOffModel } from './model/signOffModel';
import { SpeechTherapyModel } from './model/speechTherapyModel';
import { SpeechTherapySpecialTestModel } from './model/speechTherapySpecialTestModel';
import { TinnitusMaskingModel } from './model/tinnitusMaskingModel';
import { TuningForkTestModel } from './model/tuningForkTestModel';
import { TympanometryModel } from './model/tympanometryModel';

@Injectable({
  providedIn: 'root'
})

export class AudiologyService {

  constructor(private http: CustomHttpService) { }

  getTableDataForAudiology(): Promise<any> {
    return this.http.get('/Audiology/GetAllAudiologyRequests').then(res => res);
  }

  getRequestDataForAudiology(AudiologyRequestID: number): Promise<any> {
    return this.http.get('/Audiology/GetAudiologyRequestbyId?audiologyRequestID=' + AudiologyRequestID).then(res => res);
  }

  getAudiologyRecords(VisitId: number): Promise<any> {
    return this.http.get('/Triage/GetAudiologyRecords?VisitId=' + VisitId).then(res => res);
  }

  addUpdateTuningForkTest(tuningForkTestModel: TuningForkTestModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateTuningForkTest', tuningForkTestModel);
  }

  getSpeechTherapySpecialTestForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetSpeechTherapySpecialTestsForPatientVisit?VisitID=' + visitId);
  }

  addUpdateSpeechTherapySpecialTestData(speechTherapySpecialTestModel: SpeechTherapySpecialTestModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateSpeechtherapySpecialtests', speechTherapySpecialTestModel);
  }

  getOAETestForPatientVisit(visitId: number): Promise<any>{
    return this.http.get('/Audiology/GetOAETestForPatientVisit?VisitID=' + visitId);
  }

  addUpdateOAETestData(oaeTestModel: OAETestModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateOAETestData', oaeTestModel);
  }

  getBERATestForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetBERATestForPatientVisit?VisitID=' + visitId);
  }

  addUpdateBERATestData(beraTestModel: BERATestModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateBERATestData', beraTestModel);
  }

  getASSRTestForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetASSRTestForPatientVisit?VisitID=' + visitId);
  }

  addUpdateASSRTestData(assrTestModel: ASSRTestModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateASSRTestData', assrTestModel);
  }

  getHearingAidTrialDataForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetHearingAidTrialDataForPatientVisit?VisitID=' + visitId);
  }

  addUpdateHearingAidTrialData(hearingAidTrialModel: HearingAidTrialModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateHearingAidTrialData', hearingAidTrialModel);
  }

  getTinnitusMaskingDataForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetTinnitusmaskingDataForPatientVisit?VisitID=' + visitId);
  }

  addUpdateTinnitusMaskingData(tinnitusMaskingModel: TinnitusMaskingModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateTinnitusmaskingData', tinnitusMaskingModel);
  }

  getSpeechTherapyForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetSpeechTherapyForPatientVisit?VisitID=' + visitId);
  }

  addUpdateSpeechTherapyData(speechTherapyModel: SpeechTherapyModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateSpeechTherapyData', speechTherapyModel);
  }

  getElectrocochleographyForPatientVisit(visitId: number): Promise<any> {
    return this.http.get('/Audiology/GetElectrocochleographyForPatientVisit?VisitID=' + visitId);
  }

  addUpdateElectrocochleographyData(electrocochleographyModel: ElectrocochleographyModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateElectrocochleographyData', electrocochleographyModel);
  }

  getTympanometryForPatientVisit(patientId: number, visitId: number, caseSheetId: number): Promise<any> {
    return this.http.get('/Audiology/GetTympanometryForPatientVisit?PatientID=' + patientId + '&VisitID=' + visitId + '&CaseSheetID=' + caseSheetId);
  }

  addUpdateTympanometryData(tympanometryModel: TympanometryModel): Promise<any> {
    return this.http.post('/Audiology/AddUpdateTympanometry', tympanometryModel);
  }

  visitHistoryDetails(PatientID: number): Promise<any> {  
      return this.http.get('/Visit/GetVisitsbyPatientID?PatientID=' + PatientID).then(res => res);
  }

  getPatientVisitById(VisitId: any): Promise<any> {
    return this.http.get('/Visit/GetPatientVisitById?PatientVisitId=' + VisitId).then(res => res);
  }

  totalTestCount(): Promise<any> {
    return this.http.get('/Audiology/GetCountsForAudiology').then(res => res);
  }

  audiologySearch(searchModel: AudiologySearchModel): Promise<any> {
    return this.http.post('/Audiology/GetAudiologyRequestsbySearch', searchModel);
  }

  getVisitNumberForSearch(searchKey: string): Promise<any> {
    return this.http.get('/Audiology/GetVisitNumbersbySearch?searchKey=' + searchKey).then(res => res);
  }

  getFacilityNames(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

  getDoctorsForSearch(searchKey: string): Promise<any> {
    return this.http.get('/Audiology/GetAudiologyDoctorsforSearch?searchKey=' + searchKey).then(res => res);
  }

  getAllPatientData(searchKey: string): Promise<any> {
    return this.http.get('/Audiology/GetPatientsForAudiologySearch?searchKey=' + searchKey).then(res => res);
  }

  signOff(signOff: signOffModel): Promise<any> {
    return this.http.post('/Audiology/SignoffUpdationforAudiology', signOff).then(res => res);
  }

}