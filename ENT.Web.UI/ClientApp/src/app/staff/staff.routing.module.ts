import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StaffHomeComponent } from './staff-home.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { StaffEditComponent } from './staff-edit/staff-edit.component';



export const routes: Routes = [
  {
    path: "", component: StaffHomeComponent,

    children: [
      { path: 'staff', component: StaffListComponent },
      { path: 'staff-add', component: StaffAddComponent }, 
      { path: 'staffedit/:EmployeeId', component: StaffEditComponent },
      { path: '', component: StaffListComponent },     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule { }
