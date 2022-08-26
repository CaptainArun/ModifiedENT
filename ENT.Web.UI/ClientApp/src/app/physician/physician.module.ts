import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';


import { PhysicianRoutingModule } from './physician.routing.module';
import { PhysicianComponent } from './physician.component';
import { PhysicianHomeComponent } from './physician-home.component';

import { PhysicianListComponent } from './physician-list.component';
import { PhysicianCommonNoSearchComponent } from './physician-commonNoSearch.component';
import { PhysicianCommonNoVisitComponent } from './physician-commonNoVisit.component';
import { PhysicianAddComponent } from './physician-add.component';
import { PhysicianScheduleComponent } from './physician-schedule.component';
import { PhysicianCommonVisitComponent } from './physician-commonVisit.component';
import { PhysicianAddressComponent } from './physician-address.component';
import { PhysicianSpecialityComponent } from './physician-speciality.component';
import { PhysicianVacationComponent } from './physician-vacation.component';
import { PhysicianDiagnosisCodeComponent } from './physician-diagnosisCode.component';
import { PhysicianProcedureCodeComponent } from './physician-procedureCode.component';
import { PhysicianService } from './physician.service';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ViewPhysicianSpecialityComponent } from './physician-speciality-view/view-physician-speciality.component';
import { ViewPhysicianvacationComponent } from './physician-vacation-view/view-physician-vacation.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { PhysicianEducationComponent } from './Physician-education/physician-education.component';
import { PhysicianFamilyComponent } from './Physician-family/physician-family.component';
import { PhysicianLanguageComponent } from './Physician-language/physician-language.component';
import { PhysicianExtraActivityComponent } from './Physician-extraactivities/physician-extraactivity.component';
import { PhysicianAddressDetailComponent } from './Physician-addressdetail/physician-addressdetail.component';
import { physicianContactDetailComponent } from './Physician-contact/physician-contact.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    PhysicianRoutingModule,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    NewPatientModule
  ],
  declarations: [
    PhysicianHomeComponent,
    PhysicianComponent,   
    PhysicianListComponent,
    PhysicianCommonNoSearchComponent,
    PhysicianCommonNoVisitComponent,
    PhysicianAddComponent,
    PhysicianScheduleComponent,
    PhysicianCommonVisitComponent,
    PhysicianAddressComponent,
    PhysicianSpecialityComponent,
    PhysicianVacationComponent,
    PhysicianDiagnosisCodeComponent,
    PhysicianProcedureCodeComponent,
    ViewPhysicianSpecialityComponent,
    ViewPhysicianvacationComponent,
    PhysicianEducationComponent,
    PhysicianFamilyComponent,
    PhysicianLanguageComponent,
    PhysicianExtraActivityComponent,
    PhysicianAddressDetailComponent,
    physicianContactDetailComponent
  ],
    entryComponents: [
      PhysicianAddComponent,
      ViewPhysicianSpecialityComponent,
      ViewPhysicianvacationComponent,
      PhysicianEducationComponent,
      PhysicianFamilyComponent,
      PhysicianLanguageComponent,
      PhysicianExtraActivityComponent,
      PhysicianAddressDetailComponent,
      physicianContactDetailComponent
  ],
  providers: [PhysicianService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class PhysicianModule {
  constructor(){
   sessionStorage.clear();   
  } 
}
