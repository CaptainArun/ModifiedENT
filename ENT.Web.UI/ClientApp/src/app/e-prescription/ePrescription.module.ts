import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EPrescriptionRoutingModule } from './ePrescription-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { NewPatientModule } from '../patient/newPatient.module';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';

import { EPrescriptionHomeComponent } from './e-prescription-home/e-prescription-home.component';
import { EPrescriptionListComponent } from './e-prescription-list/e-prescription-list.component';
import { EPrescriptionRxComponent } from './e-prescription-rx/e-prescription-rx.component';
import { EPrescriptionEditComponent } from './e-prescription-edit/e-prescription-edit.component';
import { EPrescriptionRequestEditComponent } from './e-prescription-request-edit/e-prescription-request-edit.component';
import { EPrescriptionPrintComponent } from './e-prescription-print/e-prescription-print.component';

@NgModule({

  imports: [
    CommonModule,
    EPrescriptionRoutingModule,
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
    EPrescriptionHomeComponent,
    EPrescriptionListComponent,
    EPrescriptionRxComponent,
    EPrescriptionEditComponent,
    EPrescriptionRequestEditComponent,
    EPrescriptionPrintComponent
  ],

  entryComponents: [
    EPrescriptionRxComponent,
    EPrescriptionEditComponent,
    EPrescriptionRequestEditComponent,
    EPrescriptionPrintComponent
  ]

})

export class EPrescriptionModule {
  constructor() {
    sessionStorage.clear();
  }
}
