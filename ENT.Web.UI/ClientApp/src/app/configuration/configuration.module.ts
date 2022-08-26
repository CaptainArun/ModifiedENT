import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingSetupComponent } from './Setup/billing-setup/billing-setup.component';
import { NewBillingMasterComponent } from './Master Billing/new-billing-master/new-billing-master.component';
import { NewBillingSubMasterComponent } from './Master Billing/new-billing-sub-master/new-billing-sub-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BillingHomeComponent } from './billing-home/billing-home.component';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { EditBillingMasterComponent } from './Master Billing/new-billing-master/edit-billing-master/edit-billing-master.component';
import { ViewBillingMasterComponent } from './Master Billing/new-billing-master/view-billing-master/view-billing-master.component';
import { ConfigurationService } from './configuration.service';
import { EditSubmasterBillingComponent } from './Master Billing/new-billing-sub-master/edit-submaster-billing/edit-submaster-billing.component';
import { ViewSubmasterBillingComponent } from './Master Billing/new-billing-sub-master/view-submaster-billing/view-submaster-billing.component';
import { ViewBillingSetupComponent } from './Setup/billing-setup/view-billing-setup/view-billing-setup.component';
import { EditBillingSetupComponent } from './Setup/billing-setup/edit-billing-setup/edit-billing-setup.component';
import { ConfigurationRoutingModule } from '././configuration-routing.module';
import { Appointmenttype } from './master-data/appointment-type/appointment-type.component'
import { HospitalComponent } from './master-data/hospital/hospital.component'
import { AddAppointmentType } from './master-data/appointment-type/add-appointment-type/add-appointment-type.component'
import { AddHospital } from './master-data/hospital/add-hospital/add-hospital.component'
import { addSalutationComponent } from './master-data/salutation/add-salutation/add-salutation.component'
import { SalutationComponent } from './master-data/salutation/salutation.component'
import { MasterDataComponent } from './master-data/master-data.component';
import { addGenderComponent } from './master-data/gender/add-gender/add-gender.component';
import { GenderComponent } from './master-data/gender/gender.component';
import { addInsuranceTypeComponent } from './master-data/insurance-type/add-insurance-type/add-insurance-type.component';
import { InsuranceComponent } from './master-data/insurance-type/insurance-type.component';
import { InsuranceCategoryComponent } from './master-data/insurance-category/insurance-category.component';
import { addInsuranceCategoryComponent } from './master-data/insurance-category/add-insurance-category/add-insurance-category.component';
import { SmokingStatusComponent } from './master-data/smoking-status/smoking-status.component';
import { addSmokingStatusComponent } from './master-data/smoking-status/add-smoking-status/add-smoking-status.component';
import { DrinkingStatusComponent } from './master-data/drinking-status/drinking-status.component';
import { addDrinkingStatusComponent } from './master-data/drinking-status/add-drinking-status/add-drinking-status.component';
import { addFamilyHistoryStatusComponent } from './master-data/family-history-status/add-family-history-status/add-family-history-status.component';
import { FamilyHistoryStatusComponent } from './master-data/family-history-status/family-history-status.component';
import { addIllnessTypeComponent } from './master-data/illness-type/add-illness-type/add-illness-type.component';
import { IllnessTypeComponent } from './master-data/illness-type/illness-type.component';
import { relationshipToPatientComponent } from './master-data/relationship-to-patient/relationship-to-patient.component';
import { addRealtionshipToPatientComponent } from './master-data/relationship-to-patient/add-relationship-to-patient/add-relationship-to-patient.component';
import { sectionComponent } from './master-data/section/section.component';
import { addSectionComponent } from './master-data/section/add-section/add-section.component';
import { referredLabComponent } from './master-data/referred-lab/referred-lab.component';
import { addReferredLabComponent } from './master-data/referred-lab/add-referred-lab/add-referred-lab.component';
import { reportFormatComponent } from './master-data/report-format/report-format.component';
import { addReportFormatComponent } from './master-data/report-format/add-report-format/add-report-format.component';
import { SpecialtyComponent } from './master-data/specialty/specialty.component';
import { addSpecialtyComponent } from './master-data/specialty/add-speciality/add-specialty.component';
import { ProcedureNameShortComponent } from './master-data/procedure-name-(short)/procedure-name-short.component';
import { addProcedureNameShortComponent } from './master-data/procedure-name-(short)/add-procedure-name-short/add-procedure-name-short.component';
import { ProcedureTypeComponent } from './master-data/procedure-Type/procedure-type.component';
import { addProcedureTypeComponent } from './master-data/procedure-Type/add-procedure-type/add-procedure-type.component';
import { patientArrivalByComponent } from './master-data/patient-arrival-by/patient-arrival-by.component'
import { addpatientArrivalByComponent } from './master-data/patient-arrival-by/add-patient-arrival-by/add-patient-arrival-by.component';
import { InitialAdmissionStatusComponent } from './master-data/initial-admission-status/initial-admission-status.component';
import { addInitialAdmissionStatusComponent } from './master-data/initial-admission-status/add-initial-admission-status/add-initial-admission-status.component';
import { AdmissionTypeComponent } from './master-data/admission-type/admission-type.component';
import { addAdmissionTypeComponent } from './master-data/admission-type/add-admission-type/add-admission-type.component';
import { locationBpComponent } from './master-data/location-BP/location-BP.component';
import { addlocationBpComponent } from './master-data/location-BP/add-location-BP/add-location-BP.component';
import { patientPositionComponent } from './master-data/patient-Position/patient-position.component';
import { addpatientPositionComponent } from './master-data/patient-Position/add-patient-position/add-patient-position.component';
import { temperatureLocationComponent } from './master-data/temperature-location/temperature-location.component';
import { addtemperatureLocationComponent } from './master-data/temperature-location/add-temperature-location/add-temperature-location.component';
import { allergyTypeComponent } from './master-data/allergy-type/allergy-type.component';
import { addallergyTypeComponent } from './master-data/allergy-type/add-allergy-type/add-allergy-type.component';
import { severityComponent } from './master-data/severity/severity.component';
import { addseverityComponent } from './master-data/severity/add-severity/add-severity.component';
import { allergyStatusComponent } from './master-data/allergy-status/allergy-status.component';
import { addallergyStatusComponent } from './master-data/allergy-status/add-allergy-status/add-allergy-status.component';
import { medicationStatusComponent } from './master-data/medication-status/medication-status.component';
import { addmedicationStatusComponent } from './master-data/medication-status/add-medication-status/add-medication-status.component';
import { medicationUnitsComponent } from './master-data/medication-units/medication-units.component';
import { addmedicationUnitsComponent } from './master-data/medication-units/add-medication-units/add-medication-units.component';
import { medicationRouteComponent } from './master-data/medication-route/medication-route.component';
import { addmedicationRouteComponent } from './master-data/medication-route/add-medication-route/add-medication-route.component';
import { dispenseFormComponent } from './master-data/dispense-form/dispense-form.component';
import { addDispenseFormComponent } from './master-data/dispense-form/add-dispense-form/add-dispense-form.component';
import { dosageFormComponent } from './master-data/dosage-form/dosage-form.component';
import { addDosageFormComponent } from './master-data/dosage-form/add-dosage-form/add-dosage-form.component';
import { patientEatRegularlyComponent } from './master-data/patient-eat-regularly/patient-eat-regularly.component';
import { addPatientEatRegularlyComponent } from './master-data/patient-eat-regularly/add-patient-eat-regularly/add-patient-eat-regularly.component';
import { foodIntakeTypeComponent } from './master-data/food-intake-type/food-intake-type.component';
import { addFoodIntakeTypeComponent } from './master-data/food-intake-type/add-food-intake-type/add-food-intake-type.component';
import { foodIntakeCategoryComponent } from './master-data/food-intake-category/food-intake-category.component';
import { addFoodIntakeCategoryComponent } from './master-data/food-intake-category/add-food-intake-category/add-food-intake-category.component';
import { bodySiteComponent } from './master-data/body-site/body-site.component';
import { addBodySiteComponent } from './master-data/body-site/add-body-site/add-body-site.component';
import { radiologyProcedureRequestedComponent } from './master-data/radiology-procedure-request/radiology-procedure-requested.component';
import { addRadiologyProcedureRequestedComponent } from './master-data/radiology-procedure-request/add-radiology-procedure-requested/add-radiology-procedure-requested.component';
import { RadiologyTypeComponent } from './master-data/radiology-type/radiology-type.component';
import { addRadiologyTypeComponent } from './master-data/radiology-type/add-radiology-type/add-radiology-type.component';
import { VisitTypeComponent } from './master-data/visit-type/visit-type.component';
import { VisitTypeAddComponent } from './master-data/visit-type/visit-type-add/visit-type-add.component';
import { VisitStatusComponent } from './master-data/visit-status/visit-status.component';
import { VisitStatusAddComponent } from './master-data/visit-status/visit-status-add/visit-status-add.component';
import { UrgencyComponent } from './master-data/urgency/urgency.component';
import { UrgencyAddComponent } from './master-data/urgency/urgency-add/urgency-add.component';
import { RecordedDuringComponent } from './master-data/recorded-during/recorded-during.component';
import { RecordedDuringAddComponent } from './master-data/recorded-during/recorded-during-add/recorded-during-add.component';
import { PatientArrivalConditionComponent } from './master-data/patient-arrival-condition/patient-arrival-condition.component';
import { PatientArrivalConditionAddComponent } from './master-data/patient-arrival-condition/patient-arrival-condition-add/patient-arrival-condition-add.component';
import { ConsultationTypeComponent } from './master-data/consultation-type/consultation-type.component';
import { ConsultationTypeAddComponent } from './master-data/consultation-type/consultation-type-add/consultation-type-add.component';
import { AppointmentComponent } from './master-data/appointment/appointment.component';
import { AppointmentAddComponent } from './master-data/appointment/appointment-add/appointment-add.component';
import { PainScaleComponent } from './master-data/pain-scale/pain-scale.component';
import { PainScaleAddComponent } from './master-data/pain-scale/pain-scale-add/pain-scale-add.component';
import { SymptomsComponent } from './master-data/symptoms/symptoms.component';
import { SymptomsAddComponent } from './master-data/symptoms/symptoms-add/symptoms-add.component';
import { ProblemAreaComponent } from './master-data/problem-area/problem-area.component';
import { ProblemAreaAddComponent } from './master-data/problem-area/problem-area-add/problem-area-add.component';
import { ProblemStatusComponent } from './master-data/problem-status/problem-status.component';
import { ProblemStatusAddComponent } from './master-data/problem-status/problem-status-add/problem-status-add.component';
import { ProblemTypeComponent } from './master-data/problem-type/problem-type.component';
import { ProblemTypeAddComponent } from './master-data/problem-type/problem-type-add/problem-type-add.component';
import { TreatmentTypeComponent } from './master-data/treatment-type/treatment-type.component';
import { TreatmentTypeAddComponent } from './master-data/treatment-type/treatment-type-add/treatment-type-add.component';
import { RequestedProcedureComponent } from './master-data/requested-procedure/requested-procedure.component';
import { RequestedProcedureAddComponent } from './master-data/requested-procedure/requested-procedure-add/requested-procedure-add.component';
import { ProcedureStatusComponent } from './master-data/procedure-status/procedure-status.component';
import { ProcedureStatusAddComponent } from './master-data/procedure-status/procedure-status-add/procedure-status-add.component';
import { StatusComponent } from './master-data/status/status.component';
import { StatusAddComponent } from './master-data/status/status-add/status-add.component';
import { ProgressComponent } from './master-data/progress/progress.component';
import { ProgressAddComponent } from './master-data/progress/progress-add/progress-add.component';
import { GaitComponent } from './master-data/gait/gait.component';
import { GaitAddComponent } from './master-data/gait/add-gait/add-gait.component';
import { MobilityComponent } from './master-data/mobility/mobility.component';
import { MobilityAddComponent } from './master-data/mobility/add-mobility/add-mobility.component';
import { BalanceComponent } from './master-data/balance/balance.component';
import { BalanceAddComponent } from './master-data/balance/add-balance/add-balance.component';
import { MasterHomeComponent } from './master-data/master-home/master-home.component';
import { addPatientTypeComponent } from './master-data/patient -type/add-patient -type/add-patient-type.component';
import { PatientTypeComponent } from './master-data/patient -type/patient -type.component';
import { PatientCategoryComponent } from './master-data/patient -category/patient -category.component';
import { addPatientcategoryComponent } from './master-data/patient -category/add-patient -category/add-patient-category.component';
import { IdentificationidTypeComponent } from './master-data/identification-id-type/identification-id-type.component';
import { addidenticationIdType } from './master-data/identification-id-type/add-identification-id-type/add-identifcation-id-type.component';
import { martialStatusComponent } from './master-data/marital-status/marital-status.component';
import { addmartialStatusComponent } from './master-data/marital-status/add-marital-status/add-marital-status.component';
import { ContactTypeComponent } from './master-data/contact-type/contact-type.component';
import { addContactTypeComponent } from './master-data/contact-type/add-contact-type/add-contact-type.component';
import { ReligionComponent } from './master-data/religion/religion.component';
import { addReligionComponent } from './master-data/religion/add-religion/add-religion.component';
import { RaceComponent } from './master-data/race/race.component';
import { addRaceComponent } from './master-data/race/add-race/add-race.component';
import { BloodGroupComponent } from './master-data/blood-group/blood-group.component';
import { addBloodGroupComponent } from './master-data/blood-group/add-blood-group/add-blood-group.component';
import { DepartmentComponent } from '././master-data/department/department.component';
import { DepartmentAddComponent } from '././master-data/department/add-department/add-department.component';
import { BillingStatusAddComponent } from './master-data/BillingStatus/billingStatus-add/billingStatus-add.component';
import { BillingStatusComponent } from './master-data/BillingStatus/billingStatus.component';
import { EditHospital } from './master-data/hospital/edit-hospital/edit-hospital.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { RolesAddComponent } from './master-data/roles/roles-add/roles-add.component';
import { RolesComponent } from './master-data/roles/roles.component';
import { AddressTypeComponent } from './master-data/address-type/address-type.component';
import { addAddressTypeComponent } from './master-data/address-type/add-address-type/add-address-type.component';
import { addCountryComponent } from './master-data/country/add-country/add-country.component';
import { countryComponent } from './master-data/country/country.component';
import { addLanguageComponent } from './master-data/language/add-language/add-language.component';
import { languageComponent } from './master-data/language/language.component';
import { addPaymentTypeComponent } from './master-data/payment-type/add-payment-type/add-payment-type.component';
import { paymentTypeComponent } from './master-data/payment-type/payment-type.component';
import { addStateComponent } from './master-data/state/add-state/add-state.component';
import { stateComponent } from './master-data/state/state.component';
import { addToConsultComponent } from './master-data/to-consult/add-to-consult/add-to-consult.component';
import { ToConsultComponent } from './master-data/to-consult/to-consult.component';
import { facilityComponent } from './master-data/facility/facility.component';
import { facilityAddComponent } from './master-data/facility/add-facility/add-facility.component';
import { staffUserTypeComponent } from './master-data/staff-user-type/staff-user-type.component';
import { staffUserAddComponent } from './master-data/staff-user-type/add-staff-user/add-staff-user-type.component';
import { StaffActivityTypeComponent } from './master-data/staff-activity-type/staff-activity-type.component';
import { StaffActivityAddComponent } from './master-data/staff-activity-type/add-staff-activity/add-staff-activity-type.component';
@NgModule({
  imports: [
    NewPatientModule,
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
  ],

  declarations: [
    BillingSetupComponent,
    NewBillingMasterComponent,
    NewBillingSubMasterComponent,
    BillingHomeComponent,
    EditBillingMasterComponent,
    ViewBillingMasterComponent,
    EditSubmasterBillingComponent,
    ViewSubmasterBillingComponent,
    ViewBillingSetupComponent,
    EditBillingSetupComponent,
    addSalutationComponent,
    Appointmenttype,
    SalutationComponent,
    addToConsultComponent,
    ToConsultComponent,
    HospitalComponent,
    AddHospital,
    EditHospital,
    AddAppointmentType,
    MasterDataComponent,
    GenderComponent,
    addGenderComponent,
    addInsuranceTypeComponent,
    InsuranceComponent,
    InsuranceCategoryComponent,
    addInsuranceCategoryComponent,
    addSmokingStatusComponent,
    SmokingStatusComponent,
    DrinkingStatusComponent,
    addDrinkingStatusComponent,
    FamilyHistoryStatusComponent,
    addFamilyHistoryStatusComponent,
    IllnessTypeComponent,
    addIllnessTypeComponent,
    relationshipToPatientComponent,
    addRealtionshipToPatientComponent,
    addSectionComponent,
    sectionComponent,
    referredLabComponent,
    addReferredLabComponent,
    reportFormatComponent,
    addReportFormatComponent

    //specialty
    , SpecialtyComponent,
    addSpecialtyComponent,
    //procedureType
    ProcedureTypeComponent,
    addProcedureTypeComponent,
    //procedureNameShort
    ProcedureNameShortComponent,
    addProcedureNameShortComponent,
    //patientarrivalby
    patientArrivalByComponent,
    addpatientArrivalByComponent,
    //initialadmissinstatus
    InitialAdmissionStatusComponent,
    addInitialAdmissionStatusComponent,
    //admissiontype
    AdmissionTypeComponent,
    addAdmissionTypeComponent,
    //locationBp
    locationBpComponent,
    addlocationBpComponent,
    //patient Position
    patientPositionComponent,
    addpatientPositionComponent,
    //temperature Location
    temperatureLocationComponent,
    addtemperatureLocationComponent,
    //allergy Type
    allergyTypeComponent,
    addallergyTypeComponent,
    //severity
    severityComponent,
    addseverityComponent,
    //allergy Status
    allergyStatusComponent,
    addallergyStatusComponent,
    //medication Status
    medicationStatusComponent,
    addmedicationStatusComponent,
    //medication Units
    medicationUnitsComponent,
    addmedicationUnitsComponent,
    //medication Route
    medicationRouteComponent,
    addmedicationRouteComponent,
    //dispense Form
    dispenseFormComponent,
    addDispenseFormComponent,
    //dosage Form
    dosageFormComponent,
    addDosageFormComponent,
    //patient Eat Regularly
    patientEatRegularlyComponent,
    addPatientEatRegularlyComponent,
    //food Intake Type
    foodIntakeTypeComponent,
    addFoodIntakeTypeComponent,
    //foodIntakeCategory
    foodIntakeCategoryComponent,
    addFoodIntakeCategoryComponent,
    //bodySite
    bodySiteComponent,
    addBodySiteComponent,
    //radiologyProcedureRequestedComponent
    radiologyProcedureRequestedComponent,
    addRadiologyProcedureRequestedComponent,
    //RadiologyTypeComponent
    RadiologyTypeComponent,
    addRadiologyTypeComponent,
    VisitTypeComponent,
    VisitTypeAddComponent,
    VisitStatusComponent,
    VisitStatusAddComponent,
    UrgencyComponent,
    UrgencyAddComponent,
    RecordedDuringComponent,
    RecordedDuringAddComponent,
    PatientArrivalConditionComponent,
    PatientArrivalConditionAddComponent,
    ConsultationTypeComponent,
    ConsultationTypeAddComponent,
    AppointmentComponent,
    AppointmentAddComponent,
    PainScaleComponent,
    PainScaleAddComponent,
    SymptomsComponent,
    SymptomsAddComponent,
    ProblemAreaComponent,
    ProblemAreaAddComponent,
    ProblemStatusComponent,
    ProblemStatusAddComponent,
    ProblemTypeComponent,
    ProblemTypeAddComponent,
    TreatmentTypeComponent,
    TreatmentTypeAddComponent,
    RequestedProcedureComponent,
    RequestedProcedureAddComponent,
    ProcedureStatusComponent,
    ProcedureStatusAddComponent,
    StatusComponent,
    StatusAddComponent,
    ProgressComponent,
    ProgressAddComponent,
    GaitComponent,
    GaitAddComponent,
    MobilityComponent,
    MobilityAddComponent,
    BalanceComponent,
    BalanceAddComponent,
    MasterHomeComponent,
    PatientTypeComponent,
    addPatientTypeComponent,
    PatientCategoryComponent,
    addPatientcategoryComponent,
    IdentificationidTypeComponent,
    addidenticationIdType,
    martialStatusComponent,
    addmartialStatusComponent,
    ContactTypeComponent,
    addContactTypeComponent,
    ReligionComponent,
    addReligionComponent,
    RaceComponent,
    addRaceComponent,
    BloodGroupComponent,
    addBloodGroupComponent,
    DepartmentComponent,
    DepartmentAddComponent,
    BillingStatusComponent,
    BillingStatusAddComponent,
    RolesComponent,
    RolesAddComponent,
    AddressTypeComponent,
    addAddressTypeComponent,
    addCountryComponent,
    countryComponent,
    DepartmentAddComponent,
    DepartmentComponent,
    addLanguageComponent,
    languageComponent,
    addPaymentTypeComponent,
    paymentTypeComponent,
    addStateComponent,
    stateComponent,
    facilityComponent,
    facilityAddComponent,
    staffUserTypeComponent,
    staffUserAddComponent,
    StaffActivityTypeComponent,
    StaffActivityAddComponent,
  ],

  entryComponents: [
    EditBillingMasterComponent,
    ViewBillingMasterComponent,
    EditSubmasterBillingComponent,
    ViewSubmasterBillingComponent,
    ViewBillingSetupComponent,
    EditBillingSetupComponent,
    addSalutationComponent,
    //  addToConsultComponent,
    EditHospital,
    AddHospital,
    AddAppointmentType,
    SpecialtyComponent,
    addGenderComponent,
    addInsuranceTypeComponent,
    addInsuranceCategoryComponent,
    addSmokingStatusComponent,
    addDrinkingStatusComponent,
    addFamilyHistoryStatusComponent,
    addIllnessTypeComponent,
    addRealtionshipToPatientComponent
    , addSectionComponent,
    addReferredLabComponent,
    addReportFormatComponent,
    addSpecialtyComponent,
    addProcedureTypeComponent,
    addProcedureNameShortComponent,
    addpatientArrivalByComponent,
    addInitialAdmissionStatusComponent,
    addAdmissionTypeComponent,
    addlocationBpComponent,
    addpatientPositionComponent,
    addtemperatureLocationComponent,
    addallergyTypeComponent,
    addseverityComponent,
    addallergyStatusComponent,
    addmedicationStatusComponent,
    addmedicationUnitsComponent,
    addmedicationRouteComponent,
    addDispenseFormComponent,
    addDosageFormComponent,
    addPatientEatRegularlyComponent,
    addFoodIntakeTypeComponent,
    addFoodIntakeCategoryComponent,
    addBodySiteComponent,
    addRadiologyProcedureRequestedComponent,
    addRadiologyTypeComponent,
    VisitTypeAddComponent,
    VisitStatusAddComponent,
    UrgencyAddComponent,
    RecordedDuringAddComponent,
    PatientArrivalConditionAddComponent,
    ConsultationTypeAddComponent,
    AppointmentAddComponent,
    PainScaleAddComponent,
    SymptomsAddComponent,
    ProblemAreaAddComponent,
    ProblemStatusAddComponent,
    ProblemTypeAddComponent,
    TreatmentTypeAddComponent,
    RequestedProcedureAddComponent,
    ProcedureStatusAddComponent,
    StatusAddComponent,
    ProgressAddComponent,
    GaitAddComponent,
    MobilityAddComponent,
    BalanceAddComponent,
    addPatientTypeComponent,
    addPatientcategoryComponent,
    addidenticationIdType,
    addmartialStatusComponent,
    addContactTypeComponent,
    addReligionComponent,
    addRaceComponent,
    addBloodGroupComponent,
    DepartmentAddComponent,
    BillingStatusAddComponent,
    RolesAddComponent,
    addAddressTypeComponent,
    addCountryComponent,
    DepartmentAddComponent,
    addLanguageComponent,
    addPaymentTypeComponent,
    addStateComponent,
    facilityAddComponent,
    staffUserAddComponent,
    StaffActivityAddComponent,
  ],
  providers: [ConfigurationService]

})

export class ConfigurationModule {
  constructor() {
    sessionStorage.clear();
  }
}
