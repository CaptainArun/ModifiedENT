import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DischargeRoutingModule } from '././discharge.routing.module';
import { DischargeService } from './discharge.service';
import { DischargeAddComponent} from './discharge-add/discharge-add.component';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { DischargeHomeComponent } from './discharge-home.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { DischargeListComponent } from './discharge-list/discharge-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    DischargeRoutingModule,
    NewPatientModule
  ],

  declarations: [
    DischargeHomeComponent,
    DischargeListComponent,
    DischargeAddComponent
  ],

  entryComponents: [],

  exports: [],
  
  providers: [DischargeService]
})

export class DischargeModule {
  constructor() {
    sessionStorage.clear();
  }
}
