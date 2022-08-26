import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmissionHomeComponent } from './admission-home.component';
//import { AdmissionlistComponent } from './admission-list.component'
//import { AdmissionCommonNoSearchComponent } from './admission-commonNoSearch.component';
//import { OtListComponent } from './ot-list.component';
//import { OpdTestResultComponent } from './opd-testResult.component';
//import { OpdCommonNoVisitComponent } from './opd-commonNoVisit.component';
//import { OpdCalenderComponent } from './opd-calender.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
//import { AdmissionConvertComponent } from './admission-convert/admission-convert.component';
import { ProcedureConvertComponent } from '../admission/procedure-convert/procedure-convert.component';
import { admissionPaymentComponent } from './admission-payment/admission-payment.component';

 
export const routes: Routes = [
  {
    path: '', component: AdmissionHomeComponent,
    children: [
    //{ path: 'admission', component: AdmissionlistComponent },
/*    { path: 'ot', component: OtListComponent },
      { path: 'testResult', component: OpdTestResultComponent },
      { path: 'calendar', component: OpdCalenderComponent },*/
      { path: 'newAdmission', component: NewAdmissionComponent },
     // { path: 'admissionConvert', component: AdmissionConvertComponent },
      { path: 'ProcedureConvert', component: ProcedureConvertComponent },
     // { path: 'admissionPayment', component: admissionPaymentComponent },
      { path: 'admissionpayment/:id/:PatientID', component: admissionPaymentComponent },
      { path: '', component: NewAdmissionComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdmissionRoutingModule {
}
