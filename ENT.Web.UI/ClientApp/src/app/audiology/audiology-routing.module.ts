import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudiologyASSRTestComponent } from './audiology-assrtest/audiology-assrtest.component';
import { AudiologyBERATestComponent } from './audiology-beratest/audiology-beratest.component';
import { AudiologyConsultlistComponent } from './audiology-consultlist/audiology-consultlist.component';
import { AudiologyElectrocochleographyComponent } from './audiology-electrocochleography/audiology-electrocochleography.component';
import { AudiologyHearingAidTrialComponent } from './audiology-hearing-aid-trial/audiology-hearing-aid-trial.component';
import { AudiologyHomeComponent } from './audiology-home/audiology-home.component';
import { AudiologyOAETestComponent } from './audiology-oaetest/audiology-oaetest.component';
import { AudiologySpecialTestComponent } from './audiology-specialtest/audiology-specialtest.component';
import { AudiologySpeechTherapyComponent } from './audiology-speech-therapy/audiology-speech-therapy.component';
import { AudiologyTinnitusMaskingComponent } from './audiology-tinnitus-masking/audiology-tinnitus-masking.component';
import { AudiologyTuningForkTestComponent } from './audiology-tuning-forktest/audiology-tuning-forktest.component';
import { AudiologyTympanometryComponent } from './audiology-tympanometry/audiology-tympanometry.component';

const routes: Routes = [
  {
    path: '', component: AudiologyHomeComponent,
    children: [
      { path: 'consultlist', component: AudiologyConsultlistComponent },
      { path: 'specialtest', component: AudiologySpecialTestComponent },
      { path: 'specialtest/:PatientId/:id', component: AudiologySpecialTestComponent },
      { path: 'oaetest', component: AudiologyOAETestComponent },
      { path: 'oaetest/:PatientId/:id', component: AudiologyOAETestComponent },
      { path: 'beratest', component: AudiologyBERATestComponent },
      { path: 'beratest/:PatientId/:id', component: AudiologyBERATestComponent },
      { path: 'assrtest', component: AudiologyASSRTestComponent },
      { path: 'assrtest/:PatientId/:id', component: AudiologyASSRTestComponent },
      { path: 'hearingaidtrial', component: AudiologyHearingAidTrialComponent },
      { path: 'hearingaidtrial/:PatientId/:id', component: AudiologyHearingAidTrialComponent },
      { path: 'tinnitusmasking', component: AudiologyTinnitusMaskingComponent },
      { path: 'tinnitusmasking/:PatientId/:id', component: AudiologyTinnitusMaskingComponent },
      { path: 'speechtherapy', component: AudiologySpeechTherapyComponent },
      { path: 'speechtherapy/:PatientId/:id', component: AudiologySpeechTherapyComponent },
      { path: 'electrocochleography', component: AudiologyElectrocochleographyComponent },
      { path: 'electrocochleography/:PatientId/:id', component: AudiologyElectrocochleographyComponent },
      { path: 'tuningforktest', component: AudiologyTuningForkTestComponent },
      { path: 'tympanometry', component: AudiologyTympanometryComponent },
      { path: '', component: AudiologyConsultlistComponent } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AudiologyRoutingModule { }
