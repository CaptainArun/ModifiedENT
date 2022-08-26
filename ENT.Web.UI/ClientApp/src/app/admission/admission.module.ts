import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AdmissionRoutingModule } from './admission.routing.module';
import { AdmissionHomeComponent } from './admission-home.component';
//import { AdmissionlistComponent } from './admission-list.component'
//import { AdmissionCommonNoSearchComponent } from './admission-commonNoSearch.component';
/*import { OtListComponent } from './ot-list.component';
import { OpdTestResultComponent } from './opd-testResult.component';
import { OpdCommonNoVisitComponent } from './opd-commonNoVisit.component';
import { OpdCalenderComponent } from './opd-calender.component';
import { PopupAdmissionComponent } from './popup-admission.component';*/
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { NewAdmissionViewRecordComponent } from './new-admission/new-admission-view-record/new-admission-view-record.component';
import { NewAdmissionEditRecordComponent } from './new-admission/new-admission-edit-record/new-admission-edit-record.component';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { NewAdmissionAddRecordComponent } from './new-admission/new-admission-add-record/new-admission-add-record.component';
//import { AdmissionConvertComponent } from './admission-convert/admission-convert.component';
//import { ViewAdmissionConvertComponent } from './admission-convert/view-admission-convert/view-admission-convert.component';
//import { EditAdmissionConvertComponent } from './admission-convert/edit-admission-convert/edit-admission-convert.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { ProcedureConvertComponent } from '../admission/procedure-convert/procedure-convert.component';
import { ViewProcedureConvertComponent } from '../admission/procedure-convert/view-procedure-convert/view-procedure-convert.component';
import { EditProcedureConvertComponent } from '../admission/procedure-convert/edit-procedure-convert/edit-procedure-convert.component';
import { admissionPaymentComponent } from './admission-payment/admission-payment.component';
import { admissionHeaderComponent } from './admission-header/admission-header.component';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    AdmissionRoutingModule,
    BMSTableModule,
    NewPatientModule,
    

  ],

  declarations: [
    AdmissionHomeComponent,
    //AdmissionlistComponent,
    //AdmissionCommonNoSearchComponent,
    /*  OtListComponent,    
      OpdTestResultComponent,
      OpdCommonNoVisitComponent,
      OpdCalenderComponent,
      PopupAdmissionComponent,*/
    NewAdmissionComponent,
    NewAdmissionViewRecordComponent,
    NewAdmissionEditRecordComponent,
    NewAdmissionAddRecordComponent,
    //AdmissionConvertComponent,
    //ViewAdmissionConvertComponent,
    //EditAdmissionConvertComponent,


    ProcedureConvertComponent,
    ViewProcedureConvertComponent,
    EditProcedureConvertComponent,
    admissionPaymentComponent,
    admissionHeaderComponent

  ],
  
  entryComponents: [
    // PopupAdmissionComponent,
    NewAdmissionViewRecordComponent,
    NewAdmissionEditRecordComponent,
    NewAdmissionAddRecordComponent,
    // ViewAdmissionConvertComponent,
    // EditAdmissionConvertComponent,

    ProcedureConvertComponent,
    ViewProcedureConvertComponent,
    EditProcedureConvertComponent,
    admissionPaymentComponent,
  ],

})

export class AdmissionModule {
  constructor() {
    sessionStorage.clear();
  }
}
