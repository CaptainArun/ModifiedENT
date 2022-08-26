import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TriageComponent } from './triage.component';
import { TriageHomeComponent } from './triage-home.component';
import { TriageListComponent } from './triage-list/triage-triagelist.component';
import { VisitVisitintakeComponent } from './visit-intake/visit-visitintake.component';

export const routes: Routes = [
  {
    path: '', component: TriageHomeComponent,
    children: [
      { path: 'triagecasesheet/:PatientId/:VisitId/:ProviderId', component: TriageComponent },
      { path: 'visitIntake/:PatientId/:VisitId', component: VisitVisitintakeComponent },
      { path: 'triagelist', component: TriageListComponent },
      { path: '', component: TriageListComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TriageRoutingModule { }
