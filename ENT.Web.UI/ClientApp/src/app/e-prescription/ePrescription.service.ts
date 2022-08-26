import { Injectable } from '@angular/core';
import { CustomHttpService } from '../core/custom-http.service';
import { MedicationModel } from './models/medicationModel';
import { SearchModel } from './models/searchModel';

@Injectable({
    providedIn: 'root'
})

export class EPrescriptionService {

    constructor(private http: CustomHttpService) { }

    getMedicationNumber(): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationNumber').then(res => res);
    }

    getPatientforEPrescription(searchKey: string): Promise<any> {
        return this.http.get('/EPrescription/GetPatientsForEPrescription?searchKey=' + searchKey).then(res => res);
    }

    getPatientDetailsById(PatientId: number): Promise<any> {
        return this.http.get('/EPrescription/GetPatientRecordByPatientId?PatientId=' + PatientId).then(res => res);
    }

    getVisitforMedication(PatientId: number): Promise<any> {
        return this.http.get('/EPrescription/GetVisitsbyPatientforMedication?PatientId=' + PatientId).then(res => res);
    }

    getPhysicianforEPrescription(searchKey: string): Promise<any> {
        return this.http.get('/EPrescription/GetProvidersforEPrescription?searchKey=' + searchKey).then(res => res);
    }

    getDrugCodeforEPrescription(searchKey: string): Promise<any> {
        return this.http.get('/EPrescription/GetDrugCodesforEPrescription?searchKey=' + searchKey).then(res => res);
    }

    getMedicationRouteforEPrescription(): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationRoutesforEPrescription').then(res => res);
    }

    getDiagnosisCodeforEPrescription(searchKey: string): Promise<any> {
        return this.http.get('/EPrescription/GetDiagnosisCodesforEPrescription?searchKey=' + searchKey).then(res => res);
    }

    SaveMedicationforEPrescription(medicationModel: MedicationModel): Promise<any> {
        return this.http.post('/EPrescription/AddUpdateMedicationforEPrescription', medicationModel);
    }

    getAllMedicationsList(): Promise<any> {
        return this.http.get('/EPrescription/GetAllMedications').then(res => res);
    }

    getMedicationRecordbyId(medicationId: number): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationRecordbyID?medicationId=' + medicationId);
    }

    getEPrescriptionRecord(medicationId: number): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationRecordbyID?medicationId=' + medicationId).then(res => res);
    }

    deleteEPrescriptionRecord(medicationId: number): Promise<any> {
        return this.http.get('/EPrescription/DeleteMedicationRecordbyId?medicationId=' + medicationId).then(res => res);
    }

    getAllMedicationRequestList(): Promise<any> {
        return this.http.get('/EPrescription/GetAllMedicationRequestsforMedication').then(res => res);
    }

    getEPrescriptionRequestRecord(medicationRequestId: number): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationRequestbyId?medicationRequestId=' + medicationRequestId).then(res => res);
    }

    confirmEPrescriptionRequest(medicationRequestId: number): Promise<any> {
        return this.http.get('/EPrescription/ConfirmMedicationStatus?medicationRequestId=' + medicationRequestId).then(res => res);
    }

    userVerificationEPrescriptionRequest(userName: string, Password: string): Promise<any> {
        return this.http.get('/EPrescription/UserVerification?userName=' + userName + '&Password=' + Password).then(res => res);
    }

    cancelEPrescriptionRequest(medicationRequestId: number): Promise<any> {
        return this.http.get('/EPrescription/CancelMedicationStatus?medicationRequestId=' + medicationRequestId).then(res => res);
    }

    getRxCount(): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationCounts').then(res => res);
    }

    getRxNoforSearch(searchKey: string): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationNumbersbySearch?searchKey=' + searchKey).then(res => res);
    }

    getFacilityNames(): Promise<any> {
        return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
    }

    getRxStatusforSearch(): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationStatuses').then(res => res);
    }

    ePrescriptionSearch(searchModel: SearchModel): Promise<any> {
        return this.http.post('/EPrescription/GetMedicationsbySearch', searchModel);
    }

    getMedicationRecordforPreview(medicationId: number): Promise<any> {
        return this.http.get('/EPrescription/GetMedicationRecordforPreview?medicationId=' + medicationId).then(res => res);
    }

}