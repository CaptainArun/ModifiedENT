import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudiologyRoutingModule } from './audiology-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { NewPatientModule } from '../patient/newPatient.module';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';

import { AudiologyHomeComponent } from './audiology-home/audiology-home.component';
import { AudiologyConsultlistComponent } from './audiology-consultlist/audiology-consultlist.component';
import { AudiologyImagesPopupComponent } from './audiology-images-popup/audiology-images-popup.component';
import { AudiologyCommonComponent } from './audiology-common/audiology-common.component';
import { AudiologySpecialTestComponent } from './audiology-specialtest/audiology-specialtest.component';
import { AudiologyOAETestComponent } from './audiology-oaetest/audiology-oaetest.component';
import { AudiologyBERATestComponent } from './audiology-beratest/audiology-beratest.component';
import { AudiologyASSRTestComponent } from './audiology-assrtest/audiology-assrtest.component';
import { AudiologyHearingAidTrialComponent } from './audiology-hearing-aid-trial/audiology-hearing-aid-trial.component';
import { AudiologyTinnitusMaskingComponent } from './audiology-tinnitus-masking/audiology-tinnitus-masking.component';
import { AudiologySpeechTherapyComponent } from './audiology-speech-therapy/audiology-speech-therapy.component';
import { AudiologyElectrocochleographyComponent } from './audiology-electrocochleography/audiology-electrocochleography.component';
import { AudiologyTuningForkTestComponent } from './audiology-tuning-forktest/audiology-tuning-forktest.component';
import { AudiologyTympanometryComponent } from './audiology-tympanometry/audiology-tympanometry.component';
import { AudiologyViewHistoryPopupComponent } from './audiology-viewhistory-popup/audiology-viewhistory-popup.component';

@NgModule({

  imports: [
    CommonModule,
    AudiologyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatCardModule,
    NewPatientModule,
    BMSTableModule
  ],

  declarations: [
    AudiologyHomeComponent,
    AudiologyConsultlistComponent,
    AudiologyImagesPopupComponent,
    AudiologyCommonComponent,
    AudiologySpecialTestComponent,
    AudiologyOAETestComponent,
    AudiologyBERATestComponent,
    AudiologyASSRTestComponent,
    AudiologyHearingAidTrialComponent,
    AudiologyTinnitusMaskingComponent,
    AudiologySpeechTherapyComponent,
    AudiologyElectrocochleographyComponent,
    AudiologyTuningForkTestComponent,
    AudiologyTympanometryComponent,
    AudiologyViewHistoryPopupComponent
  ],

  entryComponents: [
    AudiologyConsultlistComponent,
    AudiologyImagesPopupComponent,
    AudiologyCommonComponent,
    AudiologySpecialTestComponent,
    AudiologyOAETestComponent,
    AudiologyBERATestComponent,
    AudiologyASSRTestComponent,
    AudiologyHearingAidTrialComponent,
    AudiologyTinnitusMaskingComponent,
    AudiologySpeechTherapyComponent,
    AudiologyElectrocochleographyComponent,
    AudiologyTuningForkTestComponent,
    AudiologyTympanometryComponent,
    AudiologyViewHistoryPopupComponent
  ]
  
})

export class AudiologyModule {
  constructor() {
    sessionStorage.clear();
  }
}
