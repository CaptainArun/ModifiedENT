import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'login', loadChildren: './login/login.module#LoginModule', pathMatch: 'full',
  },  
  {
    path: 'home', component: HomeComponent, 
    children: [
      {
        path: 'admission', loadChildren: './admission/admission.module#AdmissionModule'
      },
      
      {
        path: 'newPatient', loadChildren: './patient/newPatient.module#NewPatientModule'
      },
      {
        path: 'post-procedure-care', loadChildren: './post-procedure-care/postProcedureCare.module#PostProcedureModule'
      },
      {
        path: 'procedure', loadChildren: './pre-procedure-care/procedure.module#ProcedureModule'
      },
      {
        path: 'discharge', loadChildren: './discharge/discharge.module#DischargeModule'
      },
      {
        path: 'staff', loadChildren: './staff/staff.module#StaffModule'
      },
      {
        path: 'appointments', loadChildren: './appointments/appointments.module#AppointmentsModule'
      },
      {
        path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule'
      },
      
      {
        path: 'visits', loadChildren: './visit/visit.module#VisitModule'
      },
     
      //{
      //  path: 'ot', loadChildren:  './ot/ot.module#OtModule'
      //},    
      {
        path: 'dashboard', loadChildren:  './dashboard/dashboard.module#DashboardModule'
      },  
      {
        path: 'callCenter', loadChildren:  './call-center/callCenter.module#CallCenterModule'
      }, 
      {
        path: 'physician', loadChildren:  './physician/physician.module#PhysicianModule'
      }, 
     
      {
        path: 'triage', loadChildren:  './triage/triage.module#TriageModule'
      },

      {
        path: 'audiology', loadChildren: './audiology/audiology.module#AudiologyModule',
      },
      {
        path: 'billing', loadChildren: './billing/billing.module#billingModule',
      },

      {
        path: 'audiology', loadChildren: './audiology/audiology.module#AudiologyModule',
      },
      {
        path: 'e-prescription', loadChildren: './e-prescription/ePrescription.module#EPrescriptionModule'
      },
      {
        path: 'e-lab', loadChildren: './e-lab/eLab.module#eLabModule',
      },
     
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule {
  
 }
