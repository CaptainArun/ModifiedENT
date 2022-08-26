import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriageRoutingModule } from './triage.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { NewPatientModule } from '../patient/newPatient.module';
import { VisitModule } from '../visit/visit.module';
import { ImgViewerModule } from 'ng-picture-viewer';

import { TriageComponent } from './triage.component';
import { TriageListComponent } from './triage-list/triage-triagelist.component';
import { TriageHomeComponent } from './triage-home.component';
import { TriageVisitIntakedPopupComponent } from './triage-visitIntakedPopup.component';
import { TriageConsultationComponent } from './triage-consultation.component';
import { TriageProgressNotesComponent } from './triage-progressNotes.component';
import { TriageTablePopupComponent } from './triage-tablePopup.component';
import { TriageImagesPopupComponent } from './triage-images/triage-imagesPopup.component';
import { TriageOtSummaryComponent } from './triage-otsummary.component';
import { TriageEditPatientRecordComponent } from './triage-editPatientRecord.component';
import { TriageViewPatientRecordComponent } from './triage-viewPatientRecord.component';
import { TriageCommonComponent } from './triage-common.component';
import { TriageCommonNoSearchComponent } from './triage-commonNoSearch.component';
import { TriageVisitSummaryComponent } from './triage-visitSummary.component';
import { TriageAssessmentComponent } from './triage-assessment.component';
import { TriageEditEprescriptionComponent } from './triage-eprescription/triage-editEprescription.component';
import { TriageEditElabOrderComponent } from './triage-elab/triage-editElabOrder.component';
import { TriageOtRequestComponent } from './triage-otRequest.component';
import { TriageOPDNursingOrderComponent } from './triage-opdNursingOrder.component';
import { TriageUpdateProgressNotesComponent } from './triage-updateProgressNotes.component';
import { TriageVitalsCommonComponent } from './triage-vitals-common.component';
import { TriageClinicPopupComponent } from './triage-clinicPopup.component';
import { AudiologyProcedureInfoComponent } from './audiology-procedure-info/audiology-procedure-info.component';
import { AudiologyRequestComponent } from './audiology-request/audiology-request.component';
import { VisitVisitintakeComponent } from './visit-intake/visit-visitintake.component';
import { UpdateAllergyComponent } from './visit-intake/update-allergy/update-allergy.component';
import { UpdateProblemListTriageComponent } from './visit-intake/update-problem-list/update-problem-list.component';
import { updateNutritionComponent } from './visit-intake/update-nutrition/update-nutrition.component';
import { AddProcedureRequestComponent } from './procedure-request/add-procedure-request.component';
import { TriageService } from './triage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    TriageRoutingModule,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    NewPatientModule,
    VisitModule,
    ImgViewerModule
  ],

  declarations: [
    TriageHomeComponent,
    TriageTablePopupComponent,
    TriageOtSummaryComponent,
    TriageComponent,
    TriageListComponent,
    TriageProgressNotesComponent,
    TriageImagesPopupComponent,
    TriageConsultationComponent,
    TriageVisitIntakedPopupComponent,
    TriageCommonComponent,
    TriageCommonNoSearchComponent,
    TriageVisitSummaryComponent,
    TriageEditPatientRecordComponent,
    TriageViewPatientRecordComponent,
    TriageAssessmentComponent,
    TriageEditEprescriptionComponent,
    TriageEditElabOrderComponent,
    TriageOtRequestComponent,
    TriageUpdateProgressNotesComponent,
    TriageOPDNursingOrderComponent,
    TriageVitalsCommonComponent,
    TriageClinicPopupComponent,
    AudiologyProcedureInfoComponent,
    AudiologyRequestComponent,
    AddProcedureRequestComponent,
    VisitVisitintakeComponent,
    UpdateAllergyComponent,
    UpdateProblemListTriageComponent,
    updateNutritionComponent
  ],

  exports: [TriageOPDNursingOrderComponent, TriageVitalsCommonComponent],

  entryComponents: [
    TriageVisitIntakedPopupComponent,
    TriageVisitSummaryComponent,
    TriageConsultationComponent,
    TriageProgressNotesComponent,
    TriageTablePopupComponent,
    TriageImagesPopupComponent,
    TriageOtSummaryComponent,
    TriageEditPatientRecordComponent,
    TriageViewPatientRecordComponent,
    TriageAssessmentComponent,
    TriageEditEprescriptionComponent,
    TriageEditElabOrderComponent,
    TriageOtRequestComponent,
    TriageUpdateProgressNotesComponent,
    TriageOPDNursingOrderComponent,
    TriageVitalsCommonComponent,
    TriageClinicPopupComponent,
    AudiologyProcedureInfoComponent,
    AudiologyRequestComponent,
    AddProcedureRequestComponent,
    UpdateAllergyComponent,
    UpdateProblemListTriageComponent,
    updateNutritionComponent
  ],

  providers: [TriageService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class TriageModule {
  constructor() {
    sessionStorage.clear();
  }

}
