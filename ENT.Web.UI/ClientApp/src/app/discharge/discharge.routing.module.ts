import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DischargeHomeComponent } from './discharge-home.component';
import { DischargeAddComponent } from './discharge-add/discharge-add.component';
import { DischargeListComponent } from './discharge-list/discharge-list.component';

export const routes: Routes = [
  {
    path: '', component: DischargeHomeComponent,   
    children: [    
      { path: 'dischargeprocedure/:AdmissionId/:PatientId', component: DischargeAddComponent },  
      { path: 'dischargelist', component: DischargeListComponent },
      { path: '', component: DischargeListComponent } 
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DischargeRoutingModule { }
