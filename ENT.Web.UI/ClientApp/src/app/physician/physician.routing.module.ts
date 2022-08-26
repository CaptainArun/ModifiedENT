import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { PhysicianHomeComponent } from './physician-home.component';
import { PhysicianListComponent } from './physician-list.component';
import { PhysicianScheduleComponent } from './physician-schedule.component';
import { PhysicianAddressComponent } from './physician-address.component';
import { PhysicianSpecialityComponent } from './physician-speciality.component';
import { PhysicianVacationComponent } from './physician-vacation.component';
import { PhysicianDiagnosisCodeComponent } from './physician-diagnosisCode.component';
import { PhysicianProcedureCodeComponent } from './physician-procedureCode.component';


export const routes: Routes = [
  {
    path: '', component: PhysicianHomeComponent,
    children: [     
      { path: 'profile', component: PhysicianComponent },
      { path: 'physicianlist', component: PhysicianListComponent },
      { path: 'physicianaddress/:ProviderId', component: PhysicianAddressComponent },
      { path: 'physicianspeciality/:ProviderId', component: PhysicianSpecialityComponent },
      { path: 'physicianschedule/:ProviderId', component: PhysicianScheduleComponent },
      { path: 'physicianvacation/:ProviderId', component: PhysicianVacationComponent },
      { path: 'physiciandiagnosiscode/:ProviderId', component: PhysicianDiagnosisCodeComponent },
      { path: 'physicianprocedurescode/:ProviderId', component: PhysicianProcedureCodeComponent },
      { path: '', component: PhysicianListComponent }
    ]
  }
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PhysicianRoutingModule {

}
