import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPatientHomeComponent } from './new-patient-home/newPatient-home.component';
import { NewPatientComponent } from './new-patient.component';
//import { NewPatientlistComponent } from './new-patient-list/new-patientlist.component';
import { PatientFamilyHistoryComponent } from './patient-family-history/patient-family-history.component';
import { PatientWorkHistoryComponent } from './patient-work-history/patient-work-history.component';
import { DocumentManagementComponent } from './document-management/document-management.component';
import { PatientDemographicComponent } from './patient-demographic/patient-demographic.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { PatientSocialHistoryComponent } from './patient-social-history/patient-social-history.component';
import { PatientInsuranceComponent } from './patient-insurance/patient-insurance.component';
import { HospitalizationHistoryComponent } from './hospitalization-history/hospitalization-history.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { PatientROSComponent } from '././patient-ros/patient-ros.component';
import { PatientNutritionComponent } from './patient-nutrition/patient-nutrition.component';
import { PatientFunctionComponent } from './patient-function/patient-function.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { MedicationComponent } from './medication/medication.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { ProcedureComponent } from './procedure/procedure.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';
import { PatientCarePlanComponent } from './patient-care-plan/patientcareplan.component';
import { PhysicalExamComponent } from './physical-exam/physical-exam.component';
import { ImmunizationComponent } from './immunization/immunization.component';
import { PatientAdmissionHomeComponent } from './patient-admission/patient-admission-home.component';
import { AudiologyComponent } from './audiology/audiology.component';
import { patienteLabComponent } from './patient-e-lab/patient-eLab.component';
import { EPrescriptionComponent } from './e-prescription/e-prescription.component';
import { DischargeComponent } from './discharge/discharge.component';

export const routes: Routes = [
  {
    path: '', component: NewPatientHomeComponent,
    //path: 'PatientDemographic', component: PatientDemographicComponent
   
    children: [
     
      { path: 'newPatient', component: NewPatientComponent },
      //{ path: 'newPatientlist', component: NewPatientlistComponent },      
      { path: 'patientHistory/:PatientId/patientInsurance', component: PatientInsuranceComponent },
      { path: 'patientHistory/:PatientId/PatientFamilyHistory', component: PatientFamilyHistoryComponent },
      { path: 'patientHistory/:PatientId/workhistory', component: PatientWorkHistoryComponent },
      { path: 'patientHistory/:PatientId/socialhistory', component: PatientSocialHistoryComponent },
      { path: 'patientHistory/:PatientId/DocumentManagement', component: DocumentManagementComponent },
      { path: 'PatientDemographic', component: PatientDemographicComponent },
      { path: 'patientHistory/:PatientId/radiology', component: RadiologyComponent },
      { path: 'patientHistory/:PatientId/hospitalHistory', component: HospitalizationHistoryComponent },
      { path: 'patientHistory/:PatientId/patientROS', component: PatientROSComponent },
      { path: 'patientHistory/:PatientId/patientNutrition', component: PatientNutritionComponent },
      { path: 'patientHistory/:PatientId/patientCognitive', component: PatientFunctionComponent },
      { path: 'patientHistory/:PatientId/patientVitals', component: PatientVitalsComponent },
      { path: 'patientHistory/:PatientId/patientMedication', component: MedicationComponent },
      { path: 'patientHistory/:PatientId/patientAllergy', component: AllergiesComponent },
      { path: 'patientHistory/:PatientId/patientProblemlist', component: ProblemListComponent },
      { path: 'patientHistory/:PatientId/Diagnosis', component: DiagnosisComponent },
      { path: 'patientHistory/:PatientId/Procedure', component: ProcedureComponent },
      { path: 'patientHistory/:PatientId/PatientVisit', component: PatientVisitComponent },
      { path: 'patientHistory/:PatientId/PatientCarePlan', component: PatientCarePlanComponent },
      { path: 'patientHistory/:PatientId/physicalexam', component: PhysicalExamComponent },
      { path: 'patientHistory/:PatientId/Immunization', component: ImmunizationComponent },
      { path: 'patientHistory/:PatientId/PatientAdmission', component: PatientAdmissionHomeComponent },
      { path: 'patientHistory/:PatientId/audiology', component: AudiologyComponent },
      { path: 'patientHistory/:PatientId/patientELab', component: patienteLabComponent },
      { path: 'patientHistory/:PatientId/e-prescription', component: EPrescriptionComponent },
      { path: 'patientHistory/:PatientId/discharge', component: DischargeComponent },
      //{ path: 'Physical', component: PhysicalExamComponent },
      //{ path: 'patientHistory/:PatientId/patientInsurance', component: PatientInsuranceComponent },
      { path: '', component: NewPatientComponent }
    ]
  }
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NewPatientRoutingModule {
}
