import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultComponent } from './consult.component';
import { ConsultHomeComponent } from './consult-home.component';
import { ConsultPhysicianConsultComponent } from './consult-physicianconsult.component';
import { ConsultAudiologyComponent } from './consult-audiology.component';
// import { ConsultSpeechTherapyComponent } from './consult-speechtherapy.component';
// import { ConsultTympanogramComponent } from './consult-tympanogram.component';
// import { ConsultOaetestComponent } from './consult-oaetest.component';
// import { ConsultBeratestComponent } from './consult-beratest.component';
// import { ConsultElectrocochleographyComponent } from './consult-electrocochleography.component';
// import { ConsultTuningforktestComponent } from './consult-tuningforktest.component';
// import { ConsultAssrTestComponent } from './consult-assrtest.component';
// import { ConsultHearingAidTrialComponent } from './consult-hearing-aid-trial.component';
// import { ConsultTinnitusMaskingComponent } from './consult-tinnitus-masking.component';
// import { ConsultSpecialTestsComponent } from './consult-specialtests.component';
// import { ConsultListPatientlistComponent } from './consult-consultlist.component';

export const routes: Routes = [
  {
    path: '', component: ConsultHomeComponent,
    children: [
      { path: 'consult', component: ConsultComponent },
      { path: 'physicianconsult', component: ConsultPhysicianConsultComponent },
      { path: 'audiology', component: ConsultAudiologyComponent },
      // { path: 'speechtherapy', component: ConsultSpeechTherapyComponent },
      // { path: 'tympanogram', component: ConsultTympanogramComponent },
      // { path: 'oaetest', component: ConsultOaetestComponent },
      // { path: 'beratest', component: ConsultBeratestComponent },
      // { path: 'electrocochleography', component: ConsultElectrocochleographyComponent },
      // { path: 'tuningforktest', component: ConsultTuningforktestComponent },
      // { path: 'assrtest', component: ConsultAssrTestComponent },
      // { path: 'hearingaidtrial', component: ConsultHearingAidTrialComponent },
      // { path: 'tinnitusmasking', component: ConsultTinnitusMaskingComponent },
      // { path: 'specialtests', component: ConsultSpecialTestsComponent },
      // { path: 'consultlist', component: ConsultListPatientlistComponent },
      // { path: 'speechtherapy/:id', component: ConsultSpeechTherapyComponent },
      // { path: 'assrtest/:id', component: ConsultAssrTestComponent },
      // { path: 'oaetest/:id', component: ConsultOaetestComponent },
      // { path: 'beratest/:id', component: ConsultBeratestComponent },
      // { path: 'hearingaidtrial/:id', component: ConsultHearingAidTrialComponent },
      // { path: 'tinnitusmasking/:id', component: ConsultTinnitusMaskingComponent },
      // { path: 'specialtests/:id', component: ConsultSpecialTestsComponent },
      // { path: 'electrocochleography/:id', component: ConsultElectrocochleographyComponent },
      { path: '', component: ConsultComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TestsRoutingModule { }
