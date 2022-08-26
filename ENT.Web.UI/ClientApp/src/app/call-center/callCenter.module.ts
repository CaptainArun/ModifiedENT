import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { CallCenterRoutingModule } from './callCenter.routing.module';

import { CallCenterHomeComponent } from './callCenter-home.component';
import { CallCenterComponent } from './callCenter.component';
import { CallCenterlistComponent } from './callCenter-list.component';
import { CallCenterAppointmentListComponent } from './callCenter-appointmentList/callCenter-appointmentList.component';
import { CallCenterOtListComponent } from './callCenter-ProcedureSurgeryList/callCenter-otList.component';
import { CallCenterLabListComponent } from './callCenter-labList.component';
import { CallCenterPopupHistoryComponent } from './callCenter-popupHistory/callCenter-popupHistory.component';
import { CallCenterService } from './callCenter.service';
import { CallCenterAppointmentAddComponent } from './callCenter-appointmentAddEdit/callCenter-appointmentAdd.component';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { AppointmentEditRecordComponent } from '../appointments/appointment-edit-record/appointment-editRecord.component';
import { AppointmentsModule } from '../appointments/appointments.module';
import { NewPatientModule } from '../patient/newPatient.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    CallCenterRoutingModule,
    BMSTableModule,
    AppointmentsModule,
    NewPatientModule,

  ],
  declarations: [
   CallCenterHomeComponent,
   CallCenterComponent,
   CallCenterlistComponent,
   CallCenterOtListComponent,
   CallCenterLabListComponent,
   CallCenterPopupHistoryComponent,
   CallCenterAppointmentListComponent,
   CallCenterAppointmentAddComponent,
  ],
  entryComponents: [
    AppointmentEditRecordComponent,
    CallCenterPopupHistoryComponent,
    CallCenterAppointmentAddComponent,
  ],
  providers:[CallCenterService]
})

export class CallCenterModule {
  constructor(){
    sessionStorage.clear();   
  } 
}
