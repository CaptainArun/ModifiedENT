import { NgModule } from '@angular/core';
import { CurrentuserComponent } from './currentuser.component';
import { MaterialModuleControls } from '../material.module';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen.component';

@NgModule({

  declarations: [CurrentuserComponent, LoadingScreenComponent],

  imports: [
    MaterialModuleControls,
    CommonModule
  ],

  exports: [CurrentuserComponent, LoadingScreenComponent]
 
})
export class CommonModuleComponent { }
