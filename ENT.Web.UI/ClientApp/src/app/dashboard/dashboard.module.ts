import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleControls } from '../material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EmployeeDashboardComponent } from './employeedashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
//import { DoctorDashboardComponent } from './doctordashboard.component'
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import {MatBadgeModule} from '@angular/material/badge';
import { ChartsModule } from 'ng2-charts';
import { EmployeeDatabaseComponent } from './employeeDatabase.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { DashboardComponent } from './dashboard.component';




@NgModule({
  declarations: [
    DashboardComponent,
    EmployeeDashboardComponent,
    DashboardHomeComponent,
    //DoctorDashboardComponent,
    EmployeeDatabaseComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    DashboardRoutingModule,
    NgxChartsModule,
    //MatBadgeModule,
    ChartsModule
    
  ]
})
export class DashboardModule {
  constructor(){
    sessionStorage.clear();   
  } 
 }
