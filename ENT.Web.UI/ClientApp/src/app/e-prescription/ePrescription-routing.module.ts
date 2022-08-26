import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EPrescriptionListComponent } from './e-prescription-list/e-prescription-list.component';

const routes: Routes = [
    {
      path: '', component: EPrescriptionListComponent,
      children: [
        { path: 'e-prescription', component: EPrescriptionListComponent }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  
  export class EPrescriptionRoutingModule { }