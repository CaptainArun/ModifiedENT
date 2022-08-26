import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { VisitComponent } from './visit.component';
import { VisitRoutingModule } from './visit.routing.module';
import { VisitHomeComponent } from './visit-home/visit-home.component';
import { VisitEditPatientRecordComponent } from './visit-edit-record/visit-editPatientRecord.component';
import { VisitViewPatientRecordComponent } from './visit-view-record/visit-viewPatientRecord.component';
import { VisitIntakeListComponent } from './visit-intake-list/visit-intakelist.component';
import { VisitViewPatientHistoryComponent } from './visit-view-history/visit-viewPatientHistory.component';
import { VisitViewVisitIntakeComponent } from './visit-view-intake/visit-viewVisitIntake.component';
import { VisitService } from './visit.service';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { VisitPaymentComponent } from './visit-payment/visit-payment.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { visitSearchListComponent } from './visit-search-list/visit-Searchlist.component';
import { visitPopupHistoryComponent } from './visit-history-popup/visit-PopupHistory.component';
import { PatientVisitHistoryComponent } from './patient-visit-history/patient-visit-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    VisitRoutingModule,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    NewPatientModule,
  ],
  declarations: [
    VisitHomeComponent,
    VisitComponent,
    VisitEditPatientRecordComponent,
    VisitViewPatientRecordComponent,
    VisitIntakeListComponent,
    VisitViewPatientHistoryComponent,
    VisitViewVisitIntakeComponent,
    VisitPaymentComponent,
    visitSearchListComponent,
    visitPopupHistoryComponent,
    PatientVisitHistoryComponent
  ],
  entryComponents: [
    VisitEditPatientRecordComponent,
    VisitViewPatientRecordComponent,
    VisitViewPatientHistoryComponent,
    VisitViewVisitIntakeComponent,
    visitPopupHistoryComponent,
    PatientVisitHistoryComponent
  ],
  providers: [VisitService]
})

export class VisitModule {
  constructor() {
    sessionStorage.clear();
  }
}
