import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, RadioControlValueAccessor } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NewPatientRoutingModule } from './newPatient.routing.module';
import { NewPatientHomeComponent } from './new-patient-home/newPatient-home.component';
import { NewPatientComponent } from './new-patient.component';
//import { NewPatientlistComponent } from './new-patient-list/new-patientlist.component'
//import { NewCommonNoSearchComponent } from './new-commonNoSearch.component';
import { NewPatientViewRecordComponent } from './patient-view-record/newPatient-viewRecord.component';
import { NewPatientEditRecordComponent } from './patient-edit-record/newPatient-editRecord.component';
import { NewPatientService } from './newPatient.service';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { PatientFamilyHistoryComponent } from './patient-family-history/patient-family-history.component';
import { PatientWorkHistoryComponent } from './patient-work-history/patient-work-history.component';
//import { PhysicalExamComponent } from './physical-exam/physical-exam.component';
import { PatientInsuranceComponent } from './patient-insurance/patient-insurance.component';
import { PatientInsuranceViewRecordComponent } from './patient-insurance/patient-insurance-view-record/patient-insurance-view-record.component';
import { PatientInsuranceEditRecordComponent } from './patient-insurance/patient-insurance-edit-record/patient-insurance-edit-record.component';
import { HospitalizationHistoryComponent } from './hospitalization-history/hospitalization-history.component';
import { HospitalizationHistoryViewRecordComponent } from './hospitalization-history/hospitalization-history-view-record/hospitalization-history-view-record.component';
import { HospitalizationHistoryEditRecordComponent } from './hospitalization-history/hospitalization-history-edit-record/hospitalization-history-edit-record.component';
import { HospitalizationHistoryAddRecordComponent } from './hospitalization-history/hospitalization-history-add-record/hospitalization-history-add-record.component';
import { PatientInsuranceAddRecordComponent } from './patient-insurance/patient-insurance-add-record/patient-insurance-add-record.component';
import { PatientDemographicComponent } from './patient-demographic/patient-demographic.component';
import { FamilyHealthHistoryEditComponent } from './patient-family-history/family-health-history-edit/family-health-history-edit.component';
import { FamilyHealthHistoryViewComponent } from './patient-family-history/family-health-history-view/family-health-history-view.component';
import { WorkHistoryViewComponent } from './patient-work-history/work-history-view/work-history-view.component';
import { WorkHistoryEditComponent } from './patient-work-history/work-history-edit/work-history-edit.component';
import { DocumentManagementComponent } from './document-management/document-management.component';
import { DocumentManagementViewComponent } from './document-management/document-management-view/document-management-view.component';
import { DocumentManagementEditComponent } from './document-management/document-management-edit/document-management-edit.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologyViewComponent } from './radiology/radiology-view/radiology-view.component';
import { RadiologyEditComponent } from './radiology/radiology-edit/radiology-edit.component';
import { WorkHistoryAddComponent } from './patient-work-history/work-history-add/work-history-add.component';
import { FamilyHealthHistoryAddComponent } from './patient-family-history/family-health-history-add/family-health-history-add.component';
import { DocumentManagementAddComponent } from './document-management/document-management-add/document-management-add.component';
import { RadiologyAddComponent } from './radiology/radiology-add/radiology-add.component';
// import { AddNewPatientComponent } from './add-new-patient/add-new-patient.component';
import { PatientSocialHistoryComponent } from './patient-social-history/patient-social-history.component';
import { PatientSocialHistoryAddComponent } from './patient-social-history/patient-social-history-add/patient-social-history-add.component';
import { PatientSocialHistoryViewComponent } from './patient-social-history/patient-social-history-view/patient-social-history-view.component';
import { PatientSocialHistoryEditComponent } from './patient-social-history/patient-social-history-edit/patient-social-history-edit.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { PatientROSComponent } from '././patient-ros/patient-ros.component';
import { PatientROSAddComponent } from '././patient-ros/patient-ros-add/patient-ros-add.component';
import { PatientROSEditComponent } from '././patient-ros/patient-ros-edit/patient-ros-edit.component';
import { PatientROSViewComponent } from '././patient-ros/patient-ros-view/patient-ros-view.component';
import { PatientNutritionComponent } from './patient-nutrition/patient-nutrition.component';
import { PatientNutritionAddComponent } from './patient-nutrition/patient-nutrition-add/patient-nutrition-add.component';
import { PatientNutritionViewComponent } from './patient-nutrition/patient-nutrition-view/patient-nutrition-view.component';
import { PatientNutritionEditComponent } from './patient-nutrition/patient-nutrition-edit/patient-nutrition-edit.component';
import { PatientFunctionComponent } from './patient-function/patient-function.component';
import { PatientFuntionViewComponent } from './patient-function/patient-funtion-view/patient-funtion-view.component';
import { PatientFuntionEditComponent } from './patient-function/patient-funtion-edit/patient-funtion-edit.component';
import { PatientFuntionAddComponent } from './patient-function/patient-funtion-add/patient-funtion-add.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';
import { PatientVitalViewComponent } from './patient-vitals/patient-vital-view/patient-vital-view.component';
import { MedicationComponent } from './medication/medication.component';
import { AddMedicationComponent } from './medication/add-medication/add-medication.component';
import { ViewMedicationComponent } from './medication/view-medication/view-medication.component';
import { UpdateMedicationComponent } from './medication/update-medication/update-medication.component';
import { ViewAllergiesComponent } from './allergies/view-allergies/view-allergies.component';
import { AddAllergiesComponent } from './allergies/add-allergies/add-allergies.component';
import { UpdateAllergiesComponent } from './allergies/update-allergies/update-allergies.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { AddProblemListComponent } from './problem-list/add-problem-list/add-problem-list.component';
import { ViewProblemListComponent } from './problem-list/view-problem-list/view-problem-list.component';
import { UpdateProblemListComponent } from './problem-list/update-problem-list/update-problem-list.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { DiagnosisAddComponent } from './diagnosis/diagnosis-add/diagnosis-add.component';
import { DiagnosisViewComponent } from './diagnosis/diagnosis-view/diagnosis-view.component';
import { DiagnosisEditComponent } from './diagnosis/diagnosis-edit/diagnosis-edit.component';
import { ProcedureComponent } from './procedure/procedure.component';
import { AddProcedureComponent } from './procedure/add-procedure/add-procedure.component';
import { ViewProcedureComponent } from './procedure/view-procedure/view-procedure.component';
import { EditProcedureComponent } from './procedure/edit-procedure/edit-procedure.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';
import { EditPatientVisitComponent } from './patient-visit/edit-patient-visit/edit-patient-visit.component';
import { ViewPatientVisitComponent } from './patient-visit/view-patient-visit/view-patient-visit.component';
//import { NewdiagnosisComponent } from './newdiagnosis/newdiagnosis.component';
//import { PhysicalExamComponent } from './physical-exam/physical-exam.component';
import { PatientCarePlanComponent } from './patient-care-plan/patientcareplan.component';
import { ViewPatientCarePlanComponent } from './patient-care-plan/view-patient-care-plan/view-patient-careplan.component';
import { AdddPatientCarePlanComponent } from './patient-care-plan/add-patient-care-plan/add-patient-careplan.component';
import { EditPatientCarePlanComponent } from './patient-care-plan/edit-patient-care-plan/edit-patient-careplan.component'
import { PhysicalExamComponent } from './physical-exam/physical-exam.component';
import { PhysicalExamAddComponent } from './physical-exam/physical-exam-add/physical-exam-add.component';
import { PhysicalExamViewComponent } from './physical-exam/physical-exam-view/physical-exam-view.component';
import { PhysicalExamEditComponent } from './physical-exam/physical-exam-edit/physical-exam-edit.component';
import { ImmunizationEditComponent } from './immunization/immunization-edit/immunization-edit.component';
import { ImmunizationViewComponent } from './immunization/immunization-view/immunization-view.component';
import { AddImmunizationComponent } from './immunization/add-immunization/add-immunization.component';
import { ImmunizationComponent } from './immunization/immunization.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NumericDirective } from '../numberonly';
import { patientBackbutton } from './patient-back-button/patient-back-button.component';
import { PatientAdmissionViewRecordComponent } from './patient-admission/patient-admission-view/patient-admission-view.component';
import { PatientAdmissionHomeComponent } from './patient-admission/patient-admission-home.component';
import { AudiologyComponent } from './audiology/audiology.component';
import { AudiologyViewComponent } from './audiology/audiology-view/audiology-view.component';
//import { ImmunizationComponent } from '././immunization/immunization.component;
//import { ImmunizationEditComponent } from './immunization*/
import { patienteLabComponent } from './patient-e-lab/patient-eLab.component';
import { patienteLabViewComponent } from './patient-e-lab/patient-eLab-View/patient-eLab-view.component';
import { EPrescriptionComponent } from './e-prescription/e-prescription.component';
import { EPrescriptionViewComponent } from './e-prescription/e-prescription-view/e-prescription-view.component';
import { DischargeComponent } from './discharge/discharge.component';
import { DischargeViewComponent } from './discharge/discharge-view/discharge-view.component';
import { PhoneMaskDirective } from '../phone-mask.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { imageCropComponent } from '../image-crop/image-crop.component';
import { AddNewPatientComponent } from './add-new-patient/add-new-patient.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    NewPatientRoutingModule,
    BMSTableModule,
    NgxQRCodeModule,
    ImageCropperModule

   

  ],
  

  declarations: [
    patientBackbutton,
    imageCropComponent,
    PhoneMaskDirective,
    // Extra
    NumericDirective,
   // NewdiagnosisComponent,
   // PhysicalExamComponent,
    //PhysicalExamComponent,

    // extra end
    NewPatientHomeComponent,
    NewPatientComponent,
   // NewPatientlistComponent,
   // NewCommonNoSearchComponent,
    NewPatientViewRecordComponent,
    NewPatientEditRecordComponent,
    AddNewPatientComponent,
    //Family History
    PatientFamilyHistoryComponent,
    FamilyHealthHistoryEditComponent,
    FamilyHealthHistoryViewComponent,
    FamilyHealthHistoryAddComponent,
    //workHistory
    PatientWorkHistoryComponent,
    WorkHistoryViewComponent,
    WorkHistoryEditComponent,
    WorkHistoryAddComponent,
    //Patient Demographic,
    PatientDemographicComponent,
    //Document Management
    DocumentManagementComponent,
    DocumentManagementViewComponent,
    DocumentManagementEditComponent,
    DocumentManagementAddComponent,
    //Radiology
    RadiologyComponent,
    RadiologyViewComponent,
    RadiologyEditComponent,
    RadiologyAddComponent,
    //Social History
    PatientSocialHistoryComponent,
    PatientSocialHistoryAddComponent,
    PatientSocialHistoryViewComponent,
    PatientSocialHistoryEditComponent,
    //Hospitalization History
    HospitalizationHistoryComponent,
    HospitalizationHistoryAddRecordComponent,
    HospitalizationHistoryViewRecordComponent,
    HospitalizationHistoryEditRecordComponent,
    //Patient Insurance
    PatientInsuranceComponent,
    PatientInsuranceAddRecordComponent,
    PatientInsuranceViewRecordComponent,
    PatientInsuranceEditRecordComponent,
    //Patient History
    PatientHistoryComponent,
    //patient ROS
    PatientROSComponent,
    PatientROSAddComponent,
    PatientROSEditComponent,
    PatientROSViewComponent,
    //Patient Nutrition
    PatientNutritionComponent,
    PatientNutritionAddComponent,
    PatientNutritionViewComponent,
    PatientNutritionEditComponent,
    //Patient Function&cognitive
    PatientFunctionComponent,
    PatientFuntionViewComponent,
    PatientFuntionEditComponent,
    PatientFuntionAddComponent,
    //Patient Vitals
    PatientVitalsComponent,
    PatientVitalViewComponent,
    //PatientMedication
    MedicationComponent,
    AddMedicationComponent,
    ViewMedicationComponent,
    UpdateMedicationComponent,
    //patient Allergy
    AllergiesComponent,
    ViewAllergiesComponent,
    AddAllergiesComponent,
    UpdateAllergiesComponent,
    //patient Problemlist
    ProblemListComponent,
    AddProblemListComponent,
    ViewProblemListComponent,
    UpdateProblemListComponent,
    //Patient Diagnosis
    DiagnosisComponent,
    DiagnosisAddComponent,
    DiagnosisViewComponent,
    DiagnosisEditComponent,
    //Patient Procedure
    ProcedureComponent,
    AddProcedureComponent,
    ViewProcedureComponent,
    EditProcedureComponent,
    //Patient Visit
    PatientVisitComponent,
    EditPatientVisitComponent,
    ViewPatientVisitComponent,
    //Patient Careplan
    PatientCarePlanComponent,
    ViewPatientCarePlanComponent,
    AdddPatientCarePlanComponent,
    EditPatientCarePlanComponent,
    //Physical Exam
    PhysicalExamComponent ,
    PhysicalExamAddComponent ,
    PhysicalExamViewComponent ,
    PhysicalExamEditComponent,
    //Immunization
    ImmunizationEditComponent,
    ImmunizationViewComponent,
    AddImmunizationComponent,
    ImmunizationComponent,
    //Patient Admission
    PatientAdmissionHomeComponent,
    PatientAdmissionViewRecordComponent,
     patienteLabComponent,
    patienteLabViewComponent,
    //Patient Audiology
    AudiologyComponent,
    AudiologyViewComponent,
    //Patient e-Prescription
    EPrescriptionComponent,
    EPrescriptionViewComponent,
    //Patient Discharge
    DischargeComponent,
    DischargeViewComponent,
  
  ],

  entryComponents: [
    NewPatientViewRecordComponent,
    imageCropComponent,
    NewPatientEditRecordComponent,
    AddNewPatientComponent,
    //Family History
    FamilyHealthHistoryViewComponent,
    FamilyHealthHistoryEditComponent,
    FamilyHealthHistoryAddComponent,
    //Work History
    WorkHistoryViewComponent,
    WorkHistoryEditComponent,
    WorkHistoryAddComponent,
    //Document Management
    DocumentManagementViewComponent,
    DocumentManagementEditComponent,
    DocumentManagementAddComponent,
    //Radiology
    RadiologyViewComponent,
    RadiologyEditComponent,
    RadiologyAddComponent,
    //Patient Social History
    PatientSocialHistoryViewComponent,
    PatientSocialHistoryEditComponent,
    PatientSocialHistoryAddComponent,
    //Hospitalization History
    HospitalizationHistoryAddRecordComponent,
    HospitalizationHistoryViewRecordComponent,
    HospitalizationHistoryEditRecordComponent,
    //Patient Insurance
    PatientInsuranceAddRecordComponent,
    PatientInsuranceViewRecordComponent,
    PatientInsuranceEditRecordComponent,
    //Patient ROS
    PatientROSAddComponent,
    PatientROSViewComponent,
    PatientROSEditComponent,
    //Patient NUtrition
    PatientNutritionAddComponent,
    PatientNutritionViewComponent,
    PatientNutritionEditComponent,
    //Patient Function&Cognitive
    PatientFuntionAddComponent,
    PatientFuntionEditComponent,
    PatientFuntionViewComponent,
    //Patient Vitals
    PatientVitalViewComponent,
    //Patient Medication
    AddMedicationComponent,
    ViewMedicationComponent,
    UpdateMedicationComponent,
    //Patient Allergy
    AddAllergiesComponent,
    ViewAllergiesComponent,
    UpdateAllergiesComponent,
    //PatientProblemlist
    AddProblemListComponent,
    ViewProblemListComponent,
    UpdateProblemListComponent,
    //Patient Diagnosis
    DiagnosisAddComponent,
    DiagnosisViewComponent,
    DiagnosisEditComponent,
    //Patient Procedure
    AddProcedureComponent,
    EditProcedureComponent,
    ViewProcedureComponent,
    //Patient Visit
    EditPatientVisitComponent,
    ViewPatientVisitComponent,
    //patient Careplan
    ViewPatientCarePlanComponent,
    AdddPatientCarePlanComponent,
    EditPatientCarePlanComponent,
    //Physical Exam    
    PhysicalExamAddComponent,
    PhysicalExamViewComponent,
    PhysicalExamEditComponent,
   // Immunization
    ImmunizationEditComponent,
    ImmunizationViewComponent,
    AddImmunizationComponent,
    //Patient Admission
    PatientAdmissionViewRecordComponent,
      patienteLabViewComponent,
    //Patient Audiology
    AudiologyViewComponent,
    //Patient e-Prescription
    EPrescriptionViewComponent,
    //Patient Discharge
    DischargeViewComponent
  ],

  exports: [PatientDemographicComponent, NumericDirective,PhoneMaskDirective],

  providers: [NewPatientService]
})

export class NewPatientModule {
  constructor(){
    sessionStorage.clear();   
  } 
}
