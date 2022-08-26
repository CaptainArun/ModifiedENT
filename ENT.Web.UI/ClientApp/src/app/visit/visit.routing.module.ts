import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitComponent } from './visit.component';
import { VisitHomeComponent } from './visit-home/visit-home.component';
import { VisitIntakeListComponent } from './visit-intake-list/visit-intakelist.component';
//import { VisitPatientlistComponent } from './visit-patient-list/visit-patientlist.component';
import { VisitPaymentComponent } from './visit-payment/visit-payment.component';

export const routes: Routes = [
  {
    path: '', component: VisitHomeComponent,
    children: [
      { path: 'visit', component: VisitComponent },
      { path: 'visitIntakeList', component: VisitIntakeListComponent },
    //  { path: 'visitpayment/:id', component: VisitPaymentComponent },
      { path: 'visitpayment/:id/:PatientId', component: VisitPaymentComponent },
    //  { path: 'visitPatientList', component: VisitPatientlistComponent },
      { path: 'visitpayment', component: VisitPaymentComponent },
      { path: '', component: VisitComponent }
    ]
  },

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class VisitRoutingModule { }
