import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeDashboardComponent } from './employeedashboard.component';
//import { DoctorDashboardComponent } from './doctordashboard.component';
import { EmployeeDatabaseComponent } from './employeeDatabase.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';

export const routes: Routes = [
  {
    path: '', component: DashboardHomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee', component: EmployeeDashboardComponent },
   //   { path: 'doctor', component: DoctorDashboardComponent },
      { path: 'database', component: EmployeeDatabaseComponent },

      { path: '', component: DashboardComponent }
    ]
  }
 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
