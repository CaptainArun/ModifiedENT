import { Injectable } from '@angular/core';
import { CustomHttpService } from '../core/custom-http.service';
import { BillingMasterModel } from './Models/BillingMasterModel';
import { BillingSubMasterModel } from './Models/BilllingSubMasterModel';
import { BillingSetupModel } from './Models/BillingSetupModel';
import { AppointmentTypeMasterModel } from "src/app/configuration/Models/appointmenttypeMasterModel";
import { SalutationMasterModel } from "src/app/configuration/Models/salutationMasterModel";
import { GenderMasterModel } from "src/app/configuration/Models/GenderMasterModel";
import { InsuranceTypeMasterModel } from "src/app/configuration/Models/insurancetypeMasterModel";
import { InsuranceCategoryMasterModel } from "src/app/configuration/Models/insurancecategoryMasterModel";
import { SmokingStatusMasterModel } from "src/app/configuration/Models/smokingStatusMasterModel";
import { DrinkingStatusMasterModel } from "src/app/configuration/Models/drinkingStatusMasterModel";
import { FamilyHistoryStatusMasterModel } from "src/app/configuration/Models/familyHistoryStatusMasterModel";
import { illnessTypeMasterModel } from "src/app/configuration/Models/illnessTypeMasterModel";
import { relationshipToPatientStatusMasterModel } from "src/app/configuration/Models/relationshipToPatientMasterModel";
import { sectionMasterModel } from "src/app/configuration/Models/sectionMasterModel";
import { referredLabMasterModel } from "src/app/configuration/Models/referredLabMasterModel";
import { reportFormatMasterModel } from "src/app/configuration/Models/reportformatMasterModel";
import { specialityMasterModel } from './Models/specialityMasterModel';
import { ProcedureNameMasterModel } from './Models/procedureNameMasterModel';
import { ProcedureTypeMasterModel } from './Models/procedureTypeMasterModel';
import { patientArrivalByMasterModel } from './Models/patientArrivalByMasterModel';
import { initialAdmissionStatusMasterModel } from './Models/initialAdmissionStatusMasterModel';
import { admissionTypeMasterModel } from './Models/admissionTypeMasterModel';
import { locationBpMasterModel } from './Models/locationBpMasterModel';
import { patientPositionMasterModel } from './Models/patientPositionMasterModel';
import { temperatureLocationMasterModel } from './Models/temperatureLocationMasterModel';
import { allergyTypeMasterModel } from './Models/allergyTypeMasterModel';
import { severityMasterModel } from './Models/severityMasterModel';
import { allergyStatusMasterModel } from './Models/allergyStatusMasterModel';
import { medicationStatusMasterModel } from './Models/medicationStatusMasterModel';
import { medicationUnitsMasterModel } from './Models/medicationUnitsMasterModel';
import { medicationRouteMasterModel } from './Models/medicationRouteMasterModel';
import { dispenseFormMasterModel } from './Models/dispenseFormMasterModel';
import { dosageFormMasterModel } from './Models/dosageFormMasterModel';
import { patientEatRegularlyMasterModel } from './Models/patientEatRegularlyMasterModel';
import { foodIntakeTypeMasterModel } from './Models/foodIntakeTypeMasterModel';
import { foodIntakeCategoryMasterModel } from './Models/foodIntakeCategoryMasterModel';
import { bodySiteMasterModel } from './Models/bodySiteMasterModel';
import { radiologyProcedureRequestedMasterModel } from './Models/radiologyProcedureRequestedMasterModel';
import { radiologyTypeMasterModel } from './Models/radiologyTypeMasterModel';
import { VisitTypeModel } from './Models/visitTypeModel';
import { VisitStatusModel } from './Models/visitStatusModel';
import { UrgencyTypeModel } from './Models/urgencyTypeModel';
import { RecordedDuringModel } from './Models/recordedDuringModel';
import { PatientArrivalConditionModel } from './Models/patientArrivalConditionModel';
import { ConsultationTypeModel } from './Models/consultationTypeModel';
import { AppointmentModel } from './Models/appointmentModel';
import { PainScaleModel } from './Models/painScaleModel';
import { SymptomsModel } from './Models/symptomsModel';
import { ProblemAreaModel } from './Models/problemAreaModel';
import { ProblemStatusModel } from './Models/problemStatusModel';
import { ProblemTypeModel } from './Models/problemTypeModel';
import { TreatmentTypeModel } from './Models/treatmentTypeModel';
import { RequestedProcedureModel } from './Models/requestedProcedureModel';
import { ProcedureStatusModel } from './Models/procedureStatusModel';
import { StatusModel } from './Models/statusModel';
import { ProgressModel } from './Models/progressModel';
import { GaitMasterModel } from './Models/gaitMasterModel';
import { MobilityMasterModel } from './Models/mobilityMasterModel';
import { BalanceMasterModel } from './Models/balanceMasterModel';
import { PatientTypeMastermodel } from './Models/patientTypeMasterModel';
import { PatientcategoryMastermodel } from './Models/patientCategoryMasterModel';
import { identificationIdTypeMasterModel } from './Models/identificationIdTypeMasterModel';
import { MaritalnStatusMasterModel } from './Models/martialStatusMasterModel';
import { ContactTypeMasterModel } from './Models/contactTypeMasterModel';
import { ReligionMasterModel } from './Models/religionMasterModel';
import { RaceMasterModel } from './Models/raceMasterModel';
import { BloodGroupMasterModel } from './Models/bloodGroupMasterModel';
import { departmentTypeMasterModel } from './Models/departmentMasterModel';
import { billingStatusMasterModel } from './Models/billingStatusMasterModel';
import { RolesModel } from './Models/rolesModel';
import { stateModel } from './Models/stateModel';
import { paymentTypeModel } from './Models/paymentTypeModel';
import { languageModel } from './Models/languageModel';
import { countryModel } from './Models/countryModel';
import { addressTypeModel } from './Models/addressTypeModel';
import { StaffActivityTypeModel } from './Models/staffActivityTypeModel';
import { staffUserTypeModel } from './Models/staffUserTypeModel';
import { facilityModel } from './Models/facilityModel';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: CustomHttpService) { }



  GetDepartmentsList(searchKey: string): Promise<any> {

    return this.http.get('/Billing/GetDepartmentList?searchKey=' + searchKey).then(res => res)
  }


  //#region masterAppointmnet
  saveappointment(model: AppointmentTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAppointmentType', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  Appointmentgrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAppointmentTypeList').then(res => res);
  }
  //#endregion
  //#region Delete saluation
  DeleteAppointment(appointmentTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAppointmentTypeRecord?appointmentTypeId=' + +appointmentTypeId).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  Appointmenteditgrid(appointmentTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAppointmentTypeByID?appointmentTypeId=' + appointmentTypeId).then(res => res);
  }
  //#endregion
  //#region Saluation
  savesalutation(model: SalutationMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateSalutation', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  salutationgrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllSalutations').then(res => res);
  }
  //#endregion
  //#region Delete saluation
  DeleteSalutation(salutationID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteSalutationRecord?salutationID=' + salutationID).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  salutationeditgrid(salutationID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetSalutationbyID?salutationID=' + salutationID).then(res => res);
  }
  //#endregion
  //#region Gender
  saveGender(model: GenderMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateGender', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  Gendergrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllGender').then(res => res);
  }
  //#endregion
  //#region Delete Gender
  DeleteGender(genderID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteGenderRecord?genderID=' + genderID).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  Gendereditgrid(genderID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetGenderbyID?genderID= ' + genderID).then(res => res);
  }
  //#endregion
  //#region Insurancetype
  saveInsurancetype(model: InsuranceTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateInsuranceType', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  Insurancegrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllInsuranceTypes').then(res => res);
  }
  //#endregion
  //#region Delete Insurance
  DeleteInsurance(insuranceTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteInsuranceTypeRecord?insuranceTypeID=' + insuranceTypeID).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  Insuranceeditgrid(insuranceTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetInsuranceTypebyID?insuranceTypeID=' + insuranceTypeID).then(res => res);
  }
  //#endregion
  //#region Insuranecategory
  savesmoking(model: SmokingStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateSmokingMaster', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  Smokingcategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetSmokingMasterList').then(res => res);
  }
  //#endregion
  //#region Delete Insurance
  DeleteSmokingcategory(smokingMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteSmokingMasterRecord?smokingMasterId=' + smokingMasterId).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  Smokingeditgridcategory(smokingMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetSmokingMasterbyId?smokingMasterId=' + smokingMasterId).then(res => res);
  }
  //#endregion
  //#region Smokingstatus
  saveInsurancecategory(model: InsuranceCategoryMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateInsuranceCategory', model).then(res => res);
  }
  //#endregion
  //#region Grid data
  Insurancecategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllInsuranceCategories').then(res => res);
  }
  //#endregion
  //#region Delete Insurance
  DeleteInsurancecategory(insuranceCategoryID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteInsuranceCategoryRecord?insuranceCategoryID=' + insuranceCategoryID).then(res => res);
  }
  //#endregion
  //#region Grid edit data
  Insuranceeditgridcategory(insuranceCategoryID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetInsuranceCategorybyID?insuranceCategoryID=' + insuranceCategoryID).then(res => res);
  }
  //#endregion


  //#region Drinking save
  savedrinking(model: DrinkingStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateDrinkingMaster', model).then(res => res);
  }
  //#endregion
  //#region Drinking Grid data
  drinkingcategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetDrinkingMasterList').then(res => res);
  }
  //#endregion
  //#region Delete Drinking
  Deletedrinkingcategory(drinkingMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteDrinkingMasterRecord?drinkingMasterId=' + drinkingMasterId).then(res => res);
  }
  //#endregion
  //#region Drinking Grid edit data
  drinkingeditgridcategory(drinkingMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetDrinkingMasterbyId?drinkingMasterId=' + drinkingMasterId).then(res => res);
  }
  //#endregion


  //#region Family save
  savefamily(model: FamilyHistoryStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFamilyHistoryStatusMaster', model).then(res => res);
  }
  //#endregion

  //#region Drinking Grid data
  familycategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetFamilyHistoryStatusMasterList').then(res => res);
  }
  //#endregion
  //#region Delete Drinking
  Deletedfamilycategory(familyHistoryStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteFamilyHistoryStatusMasterRecord?familyHistoryStatusId=' + familyHistoryStatusId).then(res => res);
  }
  //#endregion
  //#region Drinking Grid edit data
  familyeditgridcategory(familyHistoryStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFamilyHistoryStatusMasterbyId?familyHistoryStatusId=' + familyHistoryStatusId).then(res => res);
  }
  //#endregion

  //#region Illness save
  saveillness(model: illnessTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateIllnessType', model).then(res => res);
  }
  //#endregion
  //#region Illness Grid data
  illnesscategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllIllnessTypes').then(res => res);
  }
  //#endregion

  //#region Delete Illness
  Deletedillness(illnessTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteIllnessTypeRecord?illnessTypeID=' + illnessTypeID).then(res => res);
  }
  //#endregion

  //#region Illness Grid edit data
  illnesseditgridcategory(illnessTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetIllnessTypebyID?illnessTypeID=' + illnessTypeID).then(res => res);
  }
  //#endregion


  //#region RelationShip to Patient save
  saveRelationShip(model: relationshipToPatientStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRelationshiptopatient', model).then(res => res);
  }
  //#endregion

  //#region  Illness Grid data
  Relationshipcategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetRelationstoPatient').then(res => res);
  }
  //#endregion

  //#region Delete Illness
  DeletedRelationship(rspID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRelationshiptopatientRecord?rspID=' + rspID).then(res => res);
  }
  //#endregion

  //#region Illness Grid edit data
  Relationshipeditgridcategory(rspID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRelationshiptopatientbyID?rspID=' + rspID).then(res => res);
  }
  //#endregion

  //#region Section add
  savesection(model: sectionMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateBodySection', model).then(res => res);
  }
  //#endregion

  //#region Illness Grid data
  sectioncategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllBodySection').then(res => res);
  }
  //#endregion

  //#region Delete Illness
  Deletedsection(bodySectionID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteBodySectionbyID?bodySectionID=' + bodySectionID).then(res => res);
  }
  //#endregion
  //#region Illness Grid edit data
  sectioneditgridcategory(bodySectionID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetBodySectionbyID?bodySectionID=' + bodySectionID).then(res => res);
  }
  //#endregion

  //#region Section Referred
  saveReferred(model: referredLabMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateReferredLab', model).then(res => res);
  }
  //#endregion

  //#region Referred Grid data
  Referredcategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllReferredLab').then(res => res);
  }
  //#endregion

  //#region Delete Referred
  DeletedReferred(referredLabID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteReferredLabRecord?referredLabID=' + referredLabID).then(res => res);
  }
  //#endregion

  //#region Referred Grid edit data
  Referrededitgridcategory(referredLabID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetReferredLabbyID?referredLabID=' + referredLabID).then(res => res);
  }
  //#endregion

  //#region Report Referred
  saveReport(model: reportFormatMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateReportFormat', model).then(res => res);
  }
  //#endregion

  //#region Report Grid data
  Reportcategorygrid(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllReportFormat').then(res => res);
  }
  //#endregion

  //#region Delete Report
  DeletedReport(reportFormatID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteReportFormatbyID?reportFormatID=' + reportFormatID).then(res => res);
  }
  //#endregion

  //#region Report Grid edit data
  reporteditgridcategory(reportFormatID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetReportFormatbyID?reportFormatID=' + reportFormatID).then(res => res);
  }
  //#endregion

  //#region "Specialty  service"


  //#region Get Grid Data
  getSpecialtyGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetTenantSpecialityList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getSpecialtyDataofId(tenantSpecialityId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetTenantSpecialityRecordbyID?tenantSpecialityId=' + tenantSpecialityId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  DeleteSpecialityData(tenantSpecialityID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteTenantSpecialityRecord?tenantSpecialityID=' + tenantSpecialityID).then(res => res);
  }
  //#endregion


  //#region save new record
  saveNewSpecialty(specialityMasterModel: specialityMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateTenantSpeciality', specialityMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Procedure Name  service"

  //#region Get Grid Data
  getProcedureNameShortGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllProcedures?searchkey=').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getProcedureNameShortDataofId(procedureID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProceduresbyID?procedureID=' + procedureID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  DeleteProcedureNameShortData(procedureID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProceduresRecord?procedureID=' + procedureID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewProcedureName(ProcedureNameMasterModel: ProcedureNameMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProcedures', ProcedureNameMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Procedure type  service"

  //#region Get Grid Data
  getProcedureTypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllProcedureTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getProcedureTypeDataofId(procedureTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProcedureTypebyID?procedureTypeID=' + procedureTypeID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  DeleteProcedureTypeData(procedureTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProcedureTypeRecord?procedureTypeID=' + procedureTypeID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewProceduretype(ProcedureTypeMasterModel: ProcedureTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProcedureType', ProcedureTypeMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Patient Arrival By service"

  //#region Get Grid Data
  getpatientArrivalByGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientArrivalbyValues').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getpatientArrivalByDataofId(arrivalbyID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientArrivalbyRecordbyID?arrivalbyID=' + arrivalbyID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  DeletepatientArrivalBy(arrivalbyID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientArrivalByRecordbyId?arrivalbyID=' + arrivalbyID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewPatientArrivalBy(patientArrivalByMasterModel: patientArrivalByMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePatientArrivalbyRecord', patientArrivalByMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Initial Admission Status service"

  //#region Get Grid Data
  getInitialAdmissionStatusGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllAdmissionStatus').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getInitialAdmissionStatusDataofId(admissionStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAdmissionStatusbyID?admissionStatusID=' + admissionStatusID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteInitialAdmissionStatus(admissionStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAdmissionStatusRecord?admissionStatusID=' + admissionStatusID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewInitialAdmissionStatus(initialAdmissionStatusMasterModel: initialAdmissionStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAdmissionStatus', initialAdmissionStatusMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region " Admission Type service"

  //#region Get Grid Data
  getAdmissionTypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllAdmissionTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getAdmissionTypeDataofId(admissionTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAdmissionTypebyID?admissionTypeID=' + admissionTypeID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteAdmissionType(admissionTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAdmissionTypeRecord?admissionTypeID=' + admissionTypeID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewAdmissionType(admissionTypeMasterModel: admissionTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAdmissionType', admissionTypeMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region " Location bp service"

  //#region Get Grid Data
  getLocationBpGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetBPLocationList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getLocationBpDataofId(bPLocationId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetBPLocationbyId?bPLocationId=' + bPLocationId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteLocationBp(bPLocationId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteBPLocationRecord?bPLocationId=' + bPLocationId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewLocationBP(locationBpMasterModel: locationBpMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateBPLocation', locationBpMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "patient position service"

  //#region Get Grid Data
  getpatientpositionGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllPatientPositions').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getpatientPositionDataofId(patientPositionID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientPositionbyID?patientPositionID=' + patientPositionID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  Deletepatientposition(patientPositionID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientPositionRecord?patientPositionID=' + patientPositionID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewPatientPosition(patientPositionMasterModel: patientPositionMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePatientPosition', patientPositionMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "temperature location service"

  //#region Get Grid Data
  gettemperatureLocationGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllTemperatureLocations').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  gettemperatureLocationDataofId(temperatureLocationID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetTemperatureLocationbyID?temperatureLocationID=' + temperatureLocationID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletetemperatureLocation(temperatureLocationID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteTemperatureLocationRecord?temperatureLocationID=' + temperatureLocationID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewtemperatureLocation(temperatureLocationMasterModel: temperatureLocationMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateTemperatureLocation', temperatureLocationMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Allergy Type service"

  //#region Get Grid Data
  getallergyTypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllAllergyTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getallergyTypeDataofId(allergyTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAllergyTypebyId?allergyTypeId=' + allergyTypeId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteAllergyType(allergyTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAllergyTypeRecord?allergyTypeId=' + allergyTypeId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewAllergyType(allergyTypeMasterModel: allergyTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAllergyType', allergyTypeMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "severity service"

  //#region Get Grid Data
  getseverityGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllergySeverities').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getSeverityDataofId(allergySeverityId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAllergySeveritybyId?allergySeverityId=' + allergySeverityId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteSeverity(allergySeverityId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAllergySeverityRecord?allergySeverityId=' + allergySeverityId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewSeverity(severityMasterModel: severityMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAllergySeverity', severityMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "allergy status service"

  //#region Get Grid Data
  getallergyStatusGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllergyStatusMasterList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getallergyStatusDataofId(allergyStatusMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAllergyStatusMasterbyId?allergyStatusMasterId=' + allergyStatusMasterId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteAllergyStatus(allergyStatusMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAllergyStatusMasterRecord?allergyStatusMasterId=' + allergyStatusMasterId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewAllergyStatus(allergyStatusMasterModel: allergyStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAllergyStatusMaster', allergyStatusMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "medication status service"

  //#region Get Grid Data
  getMedicationStatusGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationStatusList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getMedicationStatusDataofId(medicationStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationStatusbyID?medicationStatusId=' + medicationStatusId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteMedicationStatus(medicationStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteMedicationStatusbyID?medicationStatusId=' + medicationStatusId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewMedicationStatus(medicationStatusMasterModel: medicationStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateMedicationStatus', medicationStatusMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "medication Units service"

  //#region Get Grid Data
  getMedicationUnitsGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationUnitList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getMedicationUnitsDataofId(medicationUnitsId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationUnitbyID?medicationUnitsId=' + medicationUnitsId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteMedicationUnits(medicationUnitsId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteMedicationUnit?medicationUnitsId=' + medicationUnitsId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewMedicationUnits(medicationUnitsMasterModel: medicationUnitsMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateMedicationUnit', medicationUnitsMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "medication route service"

  //#region Get Grid Data
  getMedicationRouteGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationRouteList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getMedicationRouteDataofId(medicationRouteId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetMedicationRoutebyID?medicationRouteId=' + medicationRouteId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteMedicationRoute(medicationRouteId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteMedicationRoute?medicationRouteId=' + medicationRouteId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewMedicationRoute(medicationRouteMasterModel: medicationRouteMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateMedicationRoute', medicationRouteMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "dispenseForm service"

  //#region Get Grid Data
  getDispenseFormGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetDispenseFormList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getDispenseFormDataofId(dispenseFormID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetDispenseFormbyID?dispenseFormID=' + dispenseFormID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteDispenseForm(dispenseFormID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteDispenseFormRecord?dispenseFormID=' + dispenseFormID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewDispenseForm(dispenseFormMasterModel: dispenseFormMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateDispenseForm', dispenseFormMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region "Dosage Form service"

  //#region Get Grid Data
  getDosageFormGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetDosageFormList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getDosageFormDataofId(dosageFormID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetDosageFormbyID?dosageFormID=' + dosageFormID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteDosageForm(dosageFormID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteDosageFormRecord?dosageFormID=' + dosageFormID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewDosageForm(dosageFormMasterModel: dosageFormMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateDosageForm', dosageFormMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region PatientEatRegularly service

  //#region Get Grid Data
  getPatientEatRegularlyGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientEatMasterList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getPatientEatRegularlyDataofId(patientEatMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientEatMasterbyId?patientEatMasterId=' + patientEatMasterId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletePatientEatRegularly(patientEatMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientEatMasterRecord?patientEatMasterId=' + patientEatMasterId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewPatientEatRegularly(patientEatRegularlyMasterModel: patientEatRegularlyMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePatientEatMaster', patientEatRegularlyMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region FoodIntakeType service

  //#region Get Grid Data
  getFoodIntakeTypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetFoodIntakeTypeList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getFoodIntakeTypeDataofId(foodIntakeTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFoodIntakeTypebyId?foodIntakeTypeId=' + foodIntakeTypeId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteFoodIntakeType(foodIntakeTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteFoodIntakeTypeRecord?foodIntakeTypeId=' + foodIntakeTypeId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewFoodIntakeType(foodIntakeTypeMasterModel: foodIntakeTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFoodIntakeType', foodIntakeTypeMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region FoodIntakeCategory service

  //#region Get Grid Data
  getFoodIntakeCategoryGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetFoodIntakeMasterList').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getFoodIntakeCategoryDataofId(foodIntakeMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFoodIntakeMasterbyId?foodIntakeMasterId=' + foodIntakeMasterId).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteFoodIntakeCategory(foodIntakeMasterId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteFoodIntakeMasterRecord?foodIntakeMasterId=' + foodIntakeMasterId).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewFoodIntakeCategory(foodIntakeCategoryMasterModel: foodIntakeCategoryMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFoodIntakeMaster', foodIntakeCategoryMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region BodySite service

  //#region Get Grid Data
  getBodySiteGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllBodySite').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getBodySiteDataofId(bodySiteID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetBodySitebyID?bodySiteID=' + bodySiteID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteBodySite(bodySiteID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteBodySitebyID?bodySiteID=' + bodySiteID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewBodySite(bodySiteMasterModel: bodySiteMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateBodySite', bodySiteMasterModel).then(res => res);
  }
  //#endregion

  //#endregion

  //#region  Radiology Procedure Requested service

  //#region Get Grid Data
  getRadiologyProcedureRequestedGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllRadiologyProcedureRequested').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getRadiologyProcedureRequestedDataofId(radiologyProcedureRequestedID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRadiologyProcedureRequestedbyID?radiologyProcedureRequestedID=' + radiologyProcedureRequestedID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteRadiologyProcedureRequested(radiologyProcedureRequestedID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRadiologyProcedureRequestedRecord?radiologyProcedureRequestedID=' + radiologyProcedureRequestedID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewRadiologyProcedureRequested(radiologyProcedureRequestedMasterModel: radiologyProcedureRequestedMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRadiologyProcedureRequested', radiologyProcedureRequestedMasterModel).then(res => res);
  }
  //#endregion

  //#endregion Radiology Procedure Requested service

  //#region "Radiology  Type service"

  //#region Get Grid Data
  getRadiologyTypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllRadiologyType').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getRadiologyTypeDataofId(radiologyTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRadiologyTypebyID?radiologyTypeID=' + radiologyTypeID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteRadiologyType(radiologyTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRadiologyTypeRecord?radiologyTypeID=' + radiologyTypeID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveNewRadiologyType(radiologyTypeMasterModel: radiologyTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRadiologyType', radiologyTypeMasterModel).then(res => res);
  }
  //#endregion

  //#endregion Radiology  Type service
  getProgressList(): Promise<any> {
    return this.http.get('/TenantMaster/GetCarePlanProgressMasterList').then(res => res);
  }

  getProgressbyId(carePlanProgressId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetCarePlanProgressMasterbyId?carePlanProgressId=' + carePlanProgressId).then(res => res);
  }

  deleteProgressRecord(carePlanProgressId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteCarePlanProgressMasterRecord?carePlanProgressId=' + carePlanProgressId).then(res => res);
  }

  addUpdateProgress(progressModel: ProgressModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateCarePlanProgressMaster', progressModel).then(res => res);
  }
  getVisitTypeList(): Promise<any> {
    return this.http.get('/TenantMaster/GetVisitTypeList').then(res => res);
  }

  getVisitTypeRecordbyID(visitTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetVisitTypeRecordbyID?visitTypeId=' + visitTypeId).then(res => res);
  }

  deleteVisitTypeRecord(visitTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteVisitTypeRecord?visitTypeID=' + visitTypeID).then(res => res);
  }

  addUpdateVisitType(visitTypeModel: VisitTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateVisitType', visitTypeModel).then(res => res);
  }

  getVisitStatusList(): Promise<any> {
    return this.http.get('/TenantMaster/GetVisitStatusList').then(res => res);
  }

  getVisitStatusRecordbyID(visitStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetVisitStatusRecordbyID?visitStatusId=' + visitStatusId).then(res => res);
  }

  deleteVisitStatusRecord(visitStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteVisitStatusRecord?visitStatusID=' + visitStatusID).then(res => res);
  }

  addUpdateVisitStatus(visitStatusModel: VisitStatusModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateVisitStatus', visitStatusModel).then(res => res);
  }

  getUrgencyList(): Promise<any> {
    return this.http.get('/TenantMaster/GetUrgencyTypeList').then(res => res);
  }

  getUrgencyRecordbyID(urgencyTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetUrgencyTypebyId?urgencyTypeID=' + urgencyTypeID).then(res => res);
  }

  deleteUrgencyRecord(urgencyTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteUrgencyTypeRecord?urgencyTypeID=' + urgencyTypeID).then(res => res);
  }

  addUpdateUrgency(urgencyTypeModel: UrgencyTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateUrgencyType', urgencyTypeModel).then(res => res);
  }

  getRecordedDuringList(): Promise<any> {
    return this.http.get('/TenantMaster/GetRecordedDuringList').then(res => res);
  }

  getRecordedDuringbyID(recordedDuringID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRecordedDuringbyId?recordedDuringID=' + recordedDuringID).then(res => res);
  }

  deleteRecordedDuringRecord(recordedDuringID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRecordedDuringRecord?recordedDuringID=' + recordedDuringID).then(res => res);
  }

  addUpdateRecordedDuring(recordedDuringModel: RecordedDuringModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRecordedDuring', recordedDuringModel).then(res => res);
  }

  getPatientArrivalConditions(): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientArrivalConditions').then(res => res);
  }

  getPatientArrivalConditionbyId(arrivalConditionID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientArrivalConditionbyId?arrivalConditionID=' + arrivalConditionID).then(res => res);
  }

  deletePatientArrivalConditionRecord(arrivalConditionID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientArrivalConditionRecord?arrivalConditionID=' + arrivalConditionID).then(res => res);
  }

  addUpdatePatientArrivalCondition(patientArrivalConditionModel: PatientArrivalConditionModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateArrivalCondition', patientArrivalConditionModel).then(res => res);
  }

  getConsultationTypeList(): Promise<any> {
    return this.http.get('/TenantMaster/GetConsultationTypeList').then(res => res);
  }

  getConsultationTypebyId(consultationTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetConsultationTypebyId?consultationTypeID=' + consultationTypeID).then(res => res);
  }

  deleteConsultationTypeRecord(consultationTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteConsultationTypeRecord?consultationTypeID=' + consultationTypeID).then(res => res);
  }

  addUpdateConsultationType(consultationTypeModel: ConsultationTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateConsultationType', consultationTypeModel).then(res => res);
  }

  getAppointmentList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAppointmentBookedList').then(res => res);
  }

  getAppointmentbyId(appointmentBookedID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAppointmentBookedbyId?appointmentBookedID=' + appointmentBookedID).then(res => res);
  }

  deleteAppointmentRecord(appointmentBookedID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAppointmentBookedRecord?appointmentBookedID=' + appointmentBookedID).then(res => res);
  }

  addUpdateAppointment(appointmentModel: AppointmentModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAppointmentBooked', appointmentModel).then(res => res);
  }

  getPainScaleList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllPainScales').then(res => res);
  }

  getPainScalebyId(painScaleID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPainScalebyID?painScaleID=' + painScaleID).then(res => res);
  }

  deletePainScaleRecord(painScaleID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePainScaleRecord?painScaleID=' + painScaleID).then(res => res);
  }

  addUpdatePainScale(painScaleModel: PainScaleModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePainScale', painScaleModel).then(res => res);
  }

  getSymptomsList(): Promise<any> {
    return this.http.get('/TenantMaster/GetSymptomsList').then(res => res);
  }

  getSymptombyId(symptomId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetSymptombyID?symptomId=' + symptomId).then(res => res);
  }

  deleteSymptomRecord(symptomId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteSymptomRecord?symptomId=' + symptomId).then(res => res);
  }

  addUpdateSymptoms(symptomsModel: SymptomsModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateSymptoms', symptomsModel).then(res => res);
  }

  getProblemAreasList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllProblemAreas').then(res => res);
  }

  getProblemAreabyId(problemAreaID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProblemAreabyID?problemAreaID=' + problemAreaID).then(res => res);
  }

  deleteProblemAreaRecord(problemAreaID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProblemAreaRecord?problemAreaID=' + problemAreaID).then(res => res);
  }

  addUpdateProblemArea(problemAreaModel: ProblemAreaModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProblemArea', problemAreaModel).then(res => res);
  }

  getProblemStatusList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllProblemStatuses').then(res => res);
  }

  getProblemStatusbyId(problemStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProblemStatusbyID?problemStatusID=' + problemStatusID).then(res => res);
  }

  deleteProblemStatusRecord(problemStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProblemStatusRecord?problemStatusID=' + problemStatusID).then(res => res);
  }

  addUpdateProblemStatus(problemStatusModel: ProblemStatusModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProblemStatus', problemStatusModel).then(res => res);
  }

  getProblemTypeList(): Promise<any> {
    return this.http.get('/TenantMaster/GetProblemTypeList').then(res => res);
  }

  getProblemTypebyId(problemTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProblemTypebyID?problemTypeID=' + problemTypeID).then(res => res);
  }

  deleteProblemTypeRecord(problemTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProblemTypeRecord?problemTypeID=' + problemTypeID).then(res => res);
  }

  addUpdateProblemType(problemTypeModel: ProblemTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProblemType', problemTypeModel).then(res => res);
  }

  getTreatmentTypeList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllTreatmentTypes').then(res => res);
  }

  getTreatmentTypebyId(treatmentTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetTreatmentTypebyID?treatmentTypeID=' + treatmentTypeID).then(res => res);
  }

  deleteTreatmentTypeRecord(treatmentTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteTreatmentTypeRecord?treatmentTypeID=' + treatmentTypeID).then(res => res);
  }

  addUpdateTreatmentType(treatmentTypeModel: TreatmentTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateTreatmentType', treatmentTypeModel).then(res => res);
  }

  getRequestedProcedureList(): Promise<any> {
    return this.http.get('/TenantMaster/GetRequestedProcedureList').then(res => res);
  }

  getRequestedProcedurebyId(requestedProcedureID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRequestedProcedurebyID?requestedProcedureID=' + requestedProcedureID).then(res => res);
  }

  deleteRequestedProcedureRecord(requestedProcedureID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRequestedProcedureRecord?requestedProcedureID=' + requestedProcedureID).then(res => res);
  }

  addUpdateRequestedProcedure(requestedProcedureModel: RequestedProcedureModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRequestedProcedure', requestedProcedureModel).then(res => res);
  }

  getProcedureStatusList(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllProcedureStatuses').then(res => res);
  }

  getProcedureStatusbyId(procedureStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetProcedureStatusbyID?procedureStatusID=' + procedureStatusID).then(res => res);
  }

  deleteProcedureStatusRecord(procedureStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteProcedureStatusRecord?procedureStatusID=' + procedureStatusID).then(res => res);
  }

  addUpdateProcedureStatus(procedureStatusModel: ProcedureStatusModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateProcedureStatus', procedureStatusModel).then(res => res);
  }

  getStatusList(): Promise<any> {
    return this.http.get('/TenantMaster/GetCarePlanStatusMasterList').then(res => res);
  }

  getStatusbyId(carePlanStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetCarePlanStatusMasterbyId?carePlanStatusId=' + carePlanStatusId).then(res => res);
  }

  deleteStatusRecord(carePlanStatusId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteCarePlanStatusMasterRecord?carePlanStatusId=' + carePlanStatusId).then(res => res);
  }

  addUpdateStatus(statusModel: StatusModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateCarePlanStatusMaster', statusModel).then(res => res);
  }

  getAllDiagnosisCodes(searchKey: string): Promise<any> {   /*ICD*/
    return this.http.get('/Triage/GetAllDiagnosisCodes?searchKey=' + searchKey).then(res => res);
  }


  AddUpdateBillingMasterData(MasterModel: BillingMasterModel): Promise<any> {
    return this.http.post('/Billing/AddUpdateBillingMasterData', MasterModel).then(res => res);
  }

  GetBillingMasterList(): Promise<any> {

    return this.http.get('/Billing/GetBillingMasterList').then(res => res);
  }


  DeleteBillingMasterRecord(billingMasterID: number): Promise<any> {
    return this.http.get('/Billing/DeleteBillingMasterRecord?billingMasterID=' + billingMasterID).then(res => res);
  }

  GetBillingMasterRecordbyID(billingMasterID: number): Promise<any> {
    return this.http.get('/Billing/GetBillingMasterRecordbyID?billingMasterID=' + billingMasterID).then(res => res);
  }




  AddUpdateBillingSubMasterData(SubMasterModel: BillingSubMasterModel): Promise<any> {
    return this.http.post('/Billing/AddUpdateBillingSubMasterData', SubMasterModel).then(res => res);
  }

  GetBillingSubMasterList(): Promise<any> {

    return this.http.get('/Billing/GetBillingSubMasterList').then(res => res);
  }

  GetBillingSubMasterRecordbyID(billingSubMasterID: number): Promise<any> {
    return this.http.get('/Billing/GetBillingSubMasterRecordbyID?billingSubMasterID=' + billingSubMasterID).then(res => res);
  }


  DeleteBillingSubMasterRecord(billingSubMasterID: number): Promise<any> {
    return this.http.get('/Billing/DeleteBillingSubMasterRecord?billingSubMasterID=' + billingSubMasterID).then(res => res);
  }



  GetSubMasterallowedBillingTypes(departmentID: number, searchKey: string) {

    return this.http.get('/Billing/GetSubMasterallowedBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res)



  }


  GetMasterBillingTypes(departmentID: number, searchKey: string) {

    return this.http.get('/Billing/GetMasterBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res)



  }


  getSubMasterBillingTypesforMasterBillingType(departmentID: number, searchKey: string) {

    return this.http.get('/Billing/GetMasterBillingTypes?departmentID=' + departmentID + '&searchKey=' + searchKey).then(res => res)

  }

  SubMasterBillingTypesforMasterBillingType(masterBillingID: number, searchKey: string) {

    return this.http.get('/Billing/GetSubMasterBillingTypesforMasterBillingType?masterBillingID=' + masterBillingID + '&searchKey=' + searchKey).then(res => res)
  }




  /*For adding or Updating --> Billing / AddUpdateBillingSetupMasterData(BillingSetupMasterModel billingSetupMasterModel)
Get All Billing Setup Master Records-- > Billing / GetAllSetupMasterData()
Get Single Record by ID-- > Billing / GetSetupMasterRecordbyID(int setupMasterID)
Delete Single Record by ID-- > Billing / DeleteSetUpMasterRecord(int setupMasterID)*/


  AddUpdateBillingSetupMasterData(billingSetupModel: BillingSetupModel): Promise<any> {
    return this.http.post('/Billing/AddUpdateBillingSetupMasterData', billingSetupModel).then(res => res);
  }


  GetAllSetupMasterData(): Promise<any> {

    return this.http.get('/Billing/GetAllSetupMasterData').then(res => res);
  }


  GetSetupMasterRecordbyID(setupMasterID: number): Promise<any> {
    return this.http.get('/Billing/GetSetupMasterRecordbyID?setupMasterID=' + setupMasterID).then(res => res);
  }


  DeleteSetUpMasterRecord(setupMasterID: number): Promise<any> {
    return this.http.get('/Billing/DeleteSetUpMasterRecord?setupMasterID=' + setupMasterID).then(res => res);
  }

  //#region Gait data
  Gaitgrid() {
    return this.http.get('/TenantMaster/GetAllGaitMasters').then(res => res);
  }
  //#endregion


  //#region Grid edit data
  Gaiteditgrid(gaitMasterID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetGaitMasterbyID?gaitMasterID=' + gaitMasterID).then(res => res);
  }
  //#endregion

  //#region Delete Gait data
  DeleteGait(gaitMasterID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteGaitMasterRecord?gaitMasterID=' + gaitMasterID).then(res => res);
  }
  //#endregion

  //#region Gait post
  saveGait(gaitMaster: GaitMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateGaitMaster', gaitMaster).then(res => res);
  }
  //#endregion



  //#region Mobility data
  Mobilitygrid() {
    return this.http.get('/TenantMaster/GetAllMobilities').then(res => res);
  }
  //#endregion


  //#region Mobility edit data
  Mobilityeditgrid(fcmobilityID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFCMobilitybyID?fcmobilityID=' + fcmobilityID).then(res => res);
  }
  //#endregion

  //#region Delete Mobility data
  Deletemobility(fcmobilityID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteFCMobilityRecord?fcmobilityID=' + fcmobilityID).then(res => res);
  }
  //#endregion

  //#region Mobility post
  saveMobility(fcmobility: MobilityMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFCMobility', fcmobility).then(res => res);
  }
  //#endregion




  //#region Balance data
  Balancegrid() {
    return this.http.get('/TenantMaster/GetAllBalanceList').then(res => res);
  }
  //#endregion


  //#region Balance edit data
  Balanceeditgrid(fcbalanceID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFCBalancebyID?fcbalanceID=' + fcbalanceID).then(res => res);
  }
  //#endregion

  //#region Delete Balance data
  Deletebalance(fcbalanceID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteFCBalanceRecord?fcbalanceID=' + fcbalanceID).then(res => res);
  }
  //#endregion

  //#region Balance post
  saveBalance(fcbalance: BalanceMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFCBalance', fcbalance).then(res => res);
  }
  //#endregion





  //#region Get Grid Data
  getpatienttypeGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getpatienttypeId(patientTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientTypebyID?patientTypeID=' + patientTypeID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletepatienttype(patientTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientTypeRecord?patientTypeID=' + patientTypeID).then(res => res);
  }
  //#endregion

  //#region save new record
  savepatienttype(model: PatientTypeMastermodel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePatientType', model).then(res => res);
  }
  //#endregion



  //#region Get Grid Data
  getpatientcategoryGridData(): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientCategories').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getpatientcategoryId(patientCategoryID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPatientCategorybyID?patientCategoryID=' + patientCategoryID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletepatientcategory(patientCategoryID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePatientCategoryRecord?patientCategoryID=' + patientCategoryID).then(res => res);
  }
  //#endregion

  //#region save new record
  savepatientcategory(model: PatientcategoryMastermodel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePatientCategory', model).then(res => res);
  }
  //#endregion


  //#region Get Grid Data
  getIdentificationIdType(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllIdentificationTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getIdentificationId(iDTID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetIdentificationIdTypebyID?iDTID=' + iDTID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleteIdentificationId(iDTID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteIdentificationIdTypeRecord?iDTID=' + iDTID).then(res => res);
  }
  //#endregion

  //#region save new record
  saveIdentificationId(identificationIdType: identificationIdTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateIdentificationIdType', identificationIdType).then(res => res);
  }
  //#endregion


  //#region Get Grid Data
  getmartialstatus(): Promise<any> {
    return this.http.get('/TenantMaster/GetMaritalStatuses').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getmartialstatusid(maritalStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetMaritalStatusbyID?maritalStatusID=' + maritalStatusID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletemartialstatus(maritalStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteMaritalStatusRecord?maritalStatusID=' + maritalStatusID).then(res => res);
  }
  //#endregion

  //#region save new record
  savemartialstatus(maritalStatus: MaritalnStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateMaritalStatus', maritalStatus).then(res => res);
  }
  //#endregion




  //#region Get Grid Data
  getcontacttype(): Promise<any> {
    return this.http.get('/TenantMaster/GetContactTypes').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getconatcttypeid(contactTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetContactTypebyID?contactTypeID=' + contactTypeID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletecontacttype(contactTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteContactTypeRecord?contactTypeID=' + contactTypeID).then(res => res);
  }
  //#endregion

  //#region save new record
  savecontact(contactType: ContactTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateContactType', contactType).then(res => res);
  }
  //#endregion





  //#region Get Grid Data
  getreligion(): Promise<any> {
    return this.http.get('/TenantMaster/GetReligions').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getreligionid(religionID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetReligionbyID?religionID=' + religionID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletereligion(religionID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteReligionRecord?religionID=' + religionID).then(res => res);
  }
  //#endregion

  //#region save new record
  savereligion(religion: ReligionMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateReligion', religion).then(res => res);
  }
  //#endregion



  //#region Get Grid Data
  getrace(): Promise<any> {
    return this.http.get('/TenantMaster/GetRaces').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getraceid(raceID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRacebyID?raceID=' + raceID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deleterace(raceID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteRaceRecord?raceID=' + raceID).then(res => res);
  }
  //#endregion

  //#region save new record
  saverace(race: RaceMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRace', race).then(res => res);
  }
  //#endregion





  //#region Get Grid Data
  getbloodgroup(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllBloodGroups').then(res => res);
  }
  //#endregion

  //#region Get particular data with ID
  getbloodgroupid(bloodGroupID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetBloodGroupbyID?bloodGroupID=' + bloodGroupID).then(res => res);
  }
  //#endregion

  //#region Delete Record with ID
  deletebloodgroup(bloodGroupID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteBloodGroupRecord?bloodGroupID=' + bloodGroupID).then(res => res);
  }
  //#endregion

  //#region save new record
  savebloodgroup(bloodGroup: BloodGroupMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateBloodGroup', bloodGroup).then(res => res);
  }
  //#endregion

  //#region Department data
  Departmentgrid() {
    return this.http.get('/TenantMaster/GetDepartmentList').then(res => res);
  }
  //#endregion


  //#region Department edit data
  Departmenteditgrid(departmentID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetDepartmentbyID?departmentID=' + departmentID).then(res => res);
  }
  //#endregion

  //#region Delete Department data

  DeleteDepartment(departmentID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteDepartmentRecord?departmentID=' + departmentID).then(res => res);
  }
  //#endregion

  //#region Balance post
  saveDepartment(departmentData: departmentTypeMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateDepartment', departmentData).then(res => res);
  }
  //#endregion

  //#region billing status
  getBillingStatusList(): Promise<any> {
    return this.http.get('/TenantMaster/GetBillingStatusList').then(res => res);
  }
  getBillingStatusbyId(BillingMasterStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetBillingStatusRecordbyId?BillingMasterStatusID=' + BillingMasterStatusID).then(res => res);
  }

  deleteBillingStatusRecord(BillingMasterStatusID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteBillingStatusRecordbyId?BillingMasterStatusID=' + BillingMasterStatusID).then(res => res);
  }


  addUpdateBillingStatus(billingMasterStatusData: billingStatusMasterModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateBillingMasterStatus', billingMasterStatusData).then(res => res);
  }
  //#endregion


  //#region roles
  getRolesList(): Promise<any> {
    return this.http.get('/TenantMaster/GetRolesList').then(res => res);
  }

  getRolesbyId(roleID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetRoleRecordbyId?roleID=' + roleID).then(res => res);
  }

  addUpdateRoles(roleData: RolesModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateRole', roleData).then(res => res);
  }
  //#endregion

  //#region Address Type Component
  gridDataAddressType(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllAddressTypes').then(res => res);
  }
  editRecordAddressType(addressTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetAddressTypebyID?addressTypeID=' + addressTypeID).then(res => res);
  }

  DeleteRecordAddressType(addressTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteAddressTypeRecord?addressTypeID=' + addressTypeID).then(res => res);
  }

  addUpdateAddressType(addressType: addressTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateAddressType', addressType).then(res => res);
  }
  //#endregion

  //#region country
  getGridDataForCountry(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllCountries').then(res => res);
  }

  editRecordOfCountry(countryID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetCountrybyID?countryID=' + countryID).then(res => res);
  }

  deleteRecordOfCountry(countryID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteCountryRecord?countryID=' + countryID).then(res => res);
  }

  addUpdateCountry(country: countryModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateCountry', country).then(res => res);
  }
  //#endregion

  //#region language
  getGridDataForLanguage(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllLanguages').then(res => res);
  }

  editRecordOfLanguage(languageID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetLanguagebyID?languageID=' + languageID).then(res => res);
  }

  deleteRecordOfLanguage(languageID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteLanguageRecord?languageID=' + languageID).then(res => res);
  }

  addUpdateLanguage(language: languageModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateLanguage', language).then(res => res);
  }
  //#endregion

  //#region Payment Type
  getGridDataForPaymentType(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllPaymentTypes').then(res => res);
  }

  editRecordOfPaymentType(paymentTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetPaymentTypebyID?paymentTypeID=' + paymentTypeID).then(res => res);
  }

  deleteRecordOfPaymentType(paymentTypeID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeletePaymentTypeRecord?paymentTypeID=' + paymentTypeID).then(res => res);
  }

  addUpdatePaymentType(paymentType: paymentTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdatePaymentType', paymentType).then(res => res);
  }
  //#endregion

  //#region State
  getGridDataForState(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllStates').then(res => res);
  }

  editRecordOfState(stateID: number): Promise<any> {
    return this.http.get('/TenantMaster/GetStatebyID?stateID=' + stateID).then(res => res);
  }

  deleteRecordOfState(stateID: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteStateRecord?stateID=' + stateID).then(res => res);
  }

  addUpdateState(state: stateModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateState', state).then(res => res);
  }
  //#endregion

  getFacility(): Promise<any> {
    return this.http.get('/Auth/GetFacilitiesbyUser').then(res => res);
  }

   //#region facility
   getAllFacilityData(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllFacilities').then(res => res);
  }

  getFacilityById(facilityId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetFacilitybyID?facilityId=' + facilityId).then(res => res);
  }                    //'/TenantMaster/GetFacilitybyID?facilityId=

  addUpdateFacility(facility: facilityModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateFacility', facility).then(res => res);
  }

  getAllSpecialities(): Promise<any> {
    return this.http.get('/TenantMaster/GetAllSpecialities').then(res => res);
  }
  //#endregion


  //region staffUserType

  getAllStaffUserData(): Promise<any> {
    return this.http.get('/TenantMaster/GetUserType').then(res => res);
  }

  getStaffUserById(userTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetUserTypeRecordbyID?userTypeId=' + userTypeId).then(res => res);
  }

  addUpdateStaffUser(userType: staffUserTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateUserType', userType).then(res => res);
  }

  deleteRecordofStaffUser(userTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteUserTypeRecord?userTypeId=' + userTypeId).then(res => res);
  }

  //#endregion 

  //region staff Activity Type
  getAllStaffActivity(): Promise<any> {
    return this.http.get('/TenantMaster/GetEmpExtracurricularActivitiesType').then(res => res);
  }

  getStaffActivitybyId(activityTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/GetEmpExtracurricularActivitiesTypeRecordbyID?activityTypeId=' + activityTypeId).then(res => res);
  }

  deleteRecordOfStaffActivity(activityTypeId: number): Promise<any> {
    return this.http.get('/TenantMaster/DeleteEmpExtracurricularActivitiesTypeRecord?activityTypeId=' + activityTypeId).then(res => res);
  }

  addUpdateStaffActivity(ActivityType: StaffActivityTypeModel): Promise<any> {
    return this.http.post('/TenantMaster/AddUpdateEmpExtracurricularActivitiesType', ActivityType).then(res => res);
  }
  //endregion
}

