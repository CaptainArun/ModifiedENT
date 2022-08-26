import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewBillingMasterComponent } from './Master Billing/new-billing-master/new-billing-master.component';
import { BillingHomeComponent } from './billing-home/billing-home.component';
import { BillingSetupComponent } from './Setup/billing-setup/billing-setup.component';
import { NewBillingSubMasterComponent } from './Master Billing/new-billing-sub-master/new-billing-sub-master.component';
import { MasterDataComponent } from './master-data/master-data.component';
import { SpecialtyComponent } from './master-data/specialty/specialty.component';
import { Appointmenttype } from './master-data/appointment-type/appointment-type.component'
import { HospitalComponent } from './master-data/hospital/hospital.component'
//import { addSalutationComponent } from './master-data/salutation/add-salutation/add-salutation.component'
import { SalutationComponent } from './master-data/salutation/salutation.component'
import { GenderComponent } from './master-data/gender/gender.component';
import { sectionComponent } from './master-data/section/section.component';
import { referredLabComponent } from './master-data/referred-lab/referred-lab.component';
import { reportFormatComponent } from './master-data/report-format/report-format.component';
import { allergyTypeComponent } from './master-data/allergy-type/allergy-type.component';
import { RadiologyTypeComponent } from './master-data/radiology-type/radiology-type.component';
import { AppointmentComponent } from './master-data/appointment/appointment.component';
import { BalanceComponent } from './master-data/balance/balance.component';
import { MasterHomeComponent } from './master-data/master-home/master-home.component';
import { ProblemTypeComponent } from './master-data/problem-type/problem-type.component';
import { ProcedureNameShortComponent } from './master-data/procedure-name-(short)/procedure-name-short.component';
import { InitialAdmissionStatusComponent } from './master-data/initial-admission-status/initial-admission-status.component';
import { AdmissionTypeComponent } from './master-data/admission-type/admission-type.component';
import { VisitTypeComponent } from './master-data/visit-type/visit-type.component';
import { UrgencyComponent } from './master-data/urgency/urgency.component';
import { ConsultationTypeComponent } from './master-data/consultation-type/consultation-type.component';
import { VisitStatusComponent } from './master-data/visit-status/visit-status.component';
import { patientArrivalByComponent } from './master-data/patient-arrival-by/patient-arrival-by.component';
import { ProcedureTypeComponent } from './master-data/procedure-Type/procedure-type.component';
import { PatientArrivalConditionComponent } from './master-data/patient-arrival-condition/patient-arrival-condition.component';
import { InsuranceComponent } from './master-data/insurance-type/insurance-type.component';
import { InsuranceCategoryComponent } from './master-data/insurance-category/insurance-category.component';
import { relationshipToPatientComponent } from './master-data/relationship-to-patient/relationship-to-patient.component';
import { SmokingStatusComponent } from './master-data/smoking-status/smoking-status.component';
import { DrinkingStatusComponent } from './master-data/drinking-status/drinking-status.component';
import { FamilyHistoryStatusComponent } from './master-data/family-history-status/family-history-status.component';
import { IllnessTypeComponent } from './master-data/illness-type/illness-type.component';
import { MobilityComponent } from './master-data/mobility/mobility.component';
import { GaitComponent } from './master-data/gait/gait.component';
import { RecordedDuringComponent } from './master-data/recorded-during/recorded-during.component';
import { severityComponent } from './master-data/severity/severity.component';
import { StatusComponent } from './master-data/status/status.component';
import { locationBpComponent } from './master-data/location-BP/location-BP.component';
import { patientPositionComponent } from './master-data/patient-Position/patient-position.component';
import { temperatureLocationComponent } from './master-data/temperature-location/temperature-location.component';
import { PainScaleComponent } from './master-data/pain-scale/pain-scale.component';
import { ProblemStatusComponent } from './master-data/problem-status/problem-status.component';
import { dispenseFormComponent } from './master-data/dispense-form/dispense-form.component';
import { dosageFormComponent } from './master-data/dosage-form/dosage-form.component';
import { ProblemAreaComponent } from './master-data/problem-area/problem-area.component';
import { SymptomsComponent } from './master-data/symptoms/symptoms.component';
import { TreatmentTypeComponent } from './master-data/treatment-type/treatment-type.component';
import { RequestedProcedureComponent } from './master-data/requested-procedure/requested-procedure.component';
import { ProcedureStatusComponent } from './master-data/procedure-status/procedure-status.component';
import { ProgressComponent } from './master-data/progress/progress.component';
import { allergyStatusComponent } from './master-data/allergy-status/allergy-status.component';
import { foodIntakeCategoryComponent } from './master-data/food-intake-category/food-intake-category.component';
import { foodIntakeTypeComponent } from './master-data/food-intake-type/food-intake-type.component';
import { patientEatRegularlyComponent } from './master-data/patient-eat-regularly/patient-eat-regularly.component';
import { medicationRouteComponent } from './master-data/medication-route/medication-route.component';
import { medicationStatusComponent } from './master-data/medication-status/medication-status.component';
import { medicationUnitsComponent } from './master-data/medication-units/medication-units.component';
import { radiologyProcedureRequestedComponent } from './master-data/radiology-procedure-request/radiology-procedure-requested.component';
import { bodySiteComponent } from './master-data/body-site/body-site.component';
import { PatientTypeComponent } from './master-data/patient -type/patient -type.component';
import { PatientCategoryComponent } from './master-data/patient -category/patient -category.component';
import { IdentificationidTypeComponent } from './master-data/identification-id-type/identification-id-type.component';
import { martialStatusComponent } from './master-data/marital-status/marital-status.component';
import { ContactTypeComponent } from './master-data/contact-type/contact-type.component';
import { ReligionComponent } from './master-data/religion/religion.component';
import { RaceComponent } from './master-data/race/race.component';
import { BloodGroupComponent } from './master-data/blood-group/blood-group.component';
import { BillingStatusComponent } from './master-data/BillingStatus/billingStatus.component';
import { RolesComponent } from './master-data/roles/roles.component';
import { countryComponent } from './master-data/country/country.component';
import { AddressTypeComponent } from './master-data/address-type/address-type.component';
import { languageComponent } from './master-data/language/language.component';
import { stateComponent } from './master-data/state/state.component';
import { paymentTypeComponent } from './master-data/payment-type/payment-type.component';
import { DepartmentComponent } from './master-data/department/department.component';
import { ToConsultComponent } from './master-data/to-consult/to-consult.component';
import { facilityComponent } from './master-data/facility/facility.component';
import { staffUserTypeComponent } from './master-data/staff-user-type/staff-user-type.component';
import { StaffActivityTypeComponent } from './master-data/staff-activity-type/staff-activity-type.component';

export const routes: Routes = [
  {
    path: 'mastersdata', component: MasterHomeComponent,

    children: [
      { path: '', component: SalutationComponent },
      { path: 'Specialty', component: SpecialtyComponent },
      { path: 'ProcedureType', component: ProcedureTypeComponent },//
      { path: 'ProcedureName', component: ProcedureNameShortComponent },
      { path: 'patientArrivalBy', component: patientArrivalByComponent },
      { path: 'InitialAdmissionStatus', component: InitialAdmissionStatusComponent },
      { path: 'AdmissionType', component: AdmissionTypeComponent },
      { path: 'bodySite', component: bodySiteComponent },
      { path: 'Role', component: RolesComponent },

      { path: 'Salutation', component: SalutationComponent },
      { path: 'Hospital', component: HospitalComponent },
      { path: 'ToConsult', component: ToConsultComponent },
      { path: 'AppointmentType', component: Appointmenttype },//
      { path: 'Gender', component: GenderComponent },

      { path: 'PatientArrivalCondition', component: PatientArrivalConditionComponent },
      { path: 'Visitstatus', component: VisitStatusComponent },
      { path: 'VisitType', component: VisitTypeComponent },
      { path: 'Urgency', component: UrgencyComponent },
      { path: 'Consultationtype', component: ConsultationTypeComponent },
      { path: 'Appointment', component: AppointmentComponent },
      { path: 'Recordedduring', component: RecordedDuringComponent },

      { path: 'Insurance', component: InsuranceComponent },
      { path: 'InsuranceCategory', component: InsuranceCategoryComponent },
      { path: 'relationshipToPatient', component: relationshipToPatientComponent },
      { path: 'SmokingStatus', component: SmokingStatusComponent },
      { path: 'DrinkingStatus', component: DrinkingStatusComponent },
      { path: 'FamilyHistoryStatus', component: FamilyHistoryStatusComponent },
      { path: 'IllnessType', component: IllnessTypeComponent },
      { path: 'locationBp', component: locationBpComponent },
      { path: 'patientPosition', component: patientPositionComponent },
      { path: 'temperatureLocation', component: temperatureLocationComponent },
      { path: 'PainScale', component: PainScaleComponent },
      { path: 'Allergytype', component: allergyTypeComponent },
      { path: 'Severity', component: severityComponent },
      { path: 'ProblemType', component: ProblemTypeComponent },
      { path: 'ProblemStatus', component: ProblemStatusComponent },
      { path: 'DispenseForm', component: dispenseFormComponent },
      { path: 'DosageForm', component: dosageFormComponent },

      { path: 'AllergyStatus', component: allergyStatusComponent },
      { path: 'foodIntakeCategory', component: foodIntakeCategoryComponent },
      { path: 'foodIntakeType', component: foodIntakeTypeComponent },
      { path: 'patientEatRegularly', component: patientEatRegularlyComponent },
      { path: 'medicationRoute', component: medicationRouteComponent },
      { path: 'medicationStatus', component: medicationStatusComponent },
      { path: 'medicationUnits', component: medicationUnitsComponent },



      { path: 'ProblemArea', component: ProblemAreaComponent },
      { path: 'Symptoms', component: SymptomsComponent },
      { path: 'Status', component: StatusComponent },
      { path: 'TreatmentType', component: TreatmentTypeComponent },
      { path: 'RequestedProcedure', component: RequestedProcedureComponent },
      { path: 'ProcedureStatus', component: ProcedureStatusComponent },
      { path: 'Progress', component: ProgressComponent },
      { path: 'Gait', component: GaitComponent },
      { path: 'Balance', component: BalanceComponent },
      { path: 'Mobility', component: MobilityComponent },
      { path: 'radiologyProcedureRequested', component: radiologyProcedureRequestedComponent },
      { path: 'RadiologyType', component: RadiologyTypeComponent },
      { path: 'reportFormat', component: reportFormatComponent },
      { path: 'section', component: sectionComponent },
      { path: 'referredLab', component: referredLabComponent },
      { path: 'country', component: countryComponent },
      { path: 'state', component: stateComponent },
      { path: 'addressType', component: AddressTypeComponent },
      { path: 'language', component: languageComponent },

      { path: 'department', component: DepartmentComponent },
      { path: 'paymentType', component: paymentTypeComponent },

      { path: 'setup', component: BillingSetupComponent },
      { path: 'master', component: NewBillingMasterComponent },
      { path: 'subMaster', component: NewBillingSubMasterComponent },
      { path: 'ProcedureName', component: ProcedureNameShortComponent },
      { path: 'PatientType', component: PatientTypeComponent },
      { path: 'PatientCategory', component: PatientCategoryComponent },
      { path: 'IdentificationIdType', component: IdentificationidTypeComponent },
      { path: 'MartialStatus', component: martialStatusComponent },
      { path: 'ContactType', component: ContactTypeComponent },
      { path: 'Religion', component: ReligionComponent },
      { path: 'Race', component: RaceComponent },
      { path: 'BloodGroup', component: BloodGroupComponent },
      { path: 'billingStatus', component: BillingStatusComponent },
      
      { path: 'facility', component: facilityComponent },
      { path: 'staffUserType', component: staffUserTypeComponent },
      { path: 'staffActivityType', component: StaffActivityTypeComponent },


      { path: '', component: BillingSetupComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ConfigurationRoutingModule { }


