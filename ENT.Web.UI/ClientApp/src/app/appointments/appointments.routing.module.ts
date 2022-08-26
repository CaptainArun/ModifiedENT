import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentCalendarComponent } from './appointments-calendar/appointments-appointmentcalendar.component';
import { AppointmentsCallcenterComponent } from './appointments-callcenter/appointments-callcenter.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentsHomeComponent } from './appointments-home/appointments-home.component';
import { PracticePartComponent } from './practice/practice.component';


export const routes: Routes = [
  {
    path: '', component: AppointmentsHomeComponent,
    children: [
      { path: 'scheduleappointment', component: AppointmentsComponent },
      { path: 'appointmentcalendar', component: AppointmentCalendarComponent },
      { path: 'callcenter', component: AppointmentsCallcenterComponent },
      { path: 'appointmentslist', component: AppointmentsListComponent },
      {path : 'practice', component : PracticePartComponent},
      { path: '', component: AppointmentsComponent },
    ],
  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentsRoutingModule {

}
