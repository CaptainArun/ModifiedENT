import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing.module';
import { MaterialModuleControls } from '../material.module';
import { BMSTableModule } from '../ux/bmstable/bms-table.module';
import { EmployeeDatabaseComponent } from '../dashboard/employeeDatabase.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { signUpComponent } from './signUp/signUp.component';
import { NewPatientModule } from '../patient/newPatient.module';


@NgModule(
  {
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModuleControls,
      LoginRoutingModule,
      BMSTableModule,
      DashboardModule,
      NewPatientModule,
    ],

    declarations:
      [
        LoginComponent,
        signUpComponent,
      ],

    entryComponents: [
      EmployeeDatabaseComponent, signUpComponent, 
    ],
    
    providers: [],

  }
)

export class LoginModule {

}
