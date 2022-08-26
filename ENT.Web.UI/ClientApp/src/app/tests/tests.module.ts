import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ConsultComponent } from './consult.component';
import { TestsRoutingModule } from './tests.routing.module';
import { ConsultHomeComponent } from './consult-home.component';
// import { ConsultcommonComponent } from './consult-common.component';
import { ConsultPhysicianConsultComponent } from './consult-physicianconsult.component';
import { ConsultVisitSummaryComponent } from './consult-visitSummary.component';
import { ConsultConsultationComponent } from './consult-consultation.component';
import { ConsultProgressNotesComponent } from './consult-progressNotes.component';
import { ConsultImagesPopupComponent } from './consult-imagesPopup.component';
import { ConsultAudiologyComponent } from './consult-audiology.component';
// import { ConsultSpeechTherapyComponent } from './consult-speechtherapy.component';
import { ConsultTablePopupComponent } from './consult-tablePopup.component';
// import { ConsultTympanogramComponent } from './consult-tympanogram.component';
// import { ConsultOaetestComponent } from './consult-oaetest.component';
// import { ConsultBeratestComponent } from './consult-beratest.component';
// import { ConsultElectrocochleographyComponent } from './consult-electrocochleography.component';
// import { ConsultTuningforktestComponent } from './consult-tuningforktest.component';
import { ConsultEditAudiologyComponent } from './consult-editAudiology.component';
import { ConsultViewAudiologyComponent } from './consult-viewAudiology.component';
import { ConsultAudiologyGraphComponent } from './consult-audiology-graph.component';
// import { ConsultAssrTestComponent } from './consult-assrtest.component';
// import { ConsultHearingAidTrialComponent } from './consult-hearing-aid-trial.component';
// import { ConsultTinnitusMaskingComponent } from './consult-tinnitus-masking.component';
// import { ConsultSpecialTestsComponent } from './consult-specialtests.component';
import { ConsultOtSummaryComponent } from './consult-otsummary.component';
import { ConsultDiagnosisPopupComponent } from './consult-diagnosis-popup.component';
import { OpdEditPatientRecordComponent } from './opd-editPatientRecord.component';
import { OpdViewPatientRecordComponent } from './opd-viewPatientRecord.component';
import { PatientPopupTimelineComponent } from './patient-popupTimeline.component';
import { PatientPopupTimelineVComponent } from './patient-popupTimeline-v.component';
import { OpdEditPatientRecordPhysicianComponent } from './opd-editPatientRecordPhysician.component';
// import { ConsultListPatientlistComponent } from './consult-consultlist.component';
// import { TestTestResultComponent } from './test-testResult.component'; 
import { NewPatientModule } from '../patient/newPatient.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    TestsRoutingModule,
    NgxMaterialTimepickerModule,
    NewPatientModule
  ],
  declarations: [
    ConsultHomeComponent,
    ConsultComponent,
    ConsultPhysicianConsultComponent,
    // ConsultcommonComponent,
    ConsultVisitSummaryComponent,
    ConsultConsultationComponent,
    ConsultProgressNotesComponent,
    ConsultTablePopupComponent,
    ConsultAudiologyComponent,
    // ConsultSpeechTherapyComponent,
    // ConsultTympanogramComponent,
    // ConsultOaetestComponent,
    // ConsultBeratestComponent,
    // ConsultElectrocochleographyComponent,
    // ConsultTuningforktestComponent,
    ConsultEditAudiologyComponent,
    ConsultViewAudiologyComponent,
    ConsultAudiologyGraphComponent,
    // ConsultAssrTestComponent,
    // ConsultHearingAidTrialComponent,
    // ConsultTinnitusMaskingComponent,
    // ConsultSpecialTestsComponent,
    ConsultImagesPopupComponent,
    ConsultOtSummaryComponent,
    ConsultDiagnosisPopupComponent,
    OpdEditPatientRecordComponent,
    OpdViewPatientRecordComponent,
    PatientPopupTimelineComponent,
    PatientPopupTimelineVComponent,
    OpdEditPatientRecordPhysicianComponent,
    // ConsultListPatientlistComponent,
    // TestTestResultComponent,

  ],
  entryComponents: [
    ConsultVisitSummaryComponent,
    ConsultConsultationComponent,
    ConsultProgressNotesComponent,
    ConsultEditAudiologyComponent,
    ConsultViewAudiologyComponent,
    ConsultAudiologyGraphComponent,
    ConsultTablePopupComponent,
    ConsultImagesPopupComponent,
    ConsultOtSummaryComponent,
    ConsultDiagnosisPopupComponent,
    OpdEditPatientRecordComponent,
    OpdViewPatientRecordComponent,
    PatientPopupTimelineComponent,
    PatientPopupTimelineVComponent,
    OpdEditPatientRecordPhysicianComponent,
    // TestTestResultComponent,

  ],

})

export class TestsModule { }
