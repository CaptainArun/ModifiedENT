import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule,ReactiveFormsModule,RadioControlValueAccessor} from "@angular/forms";
import { MaterialModuleControls } from "../material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { BMSTableModule } from "../ux/bmstable/bms-table.module";
import { StaffHomeComponent } from './staff-home.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffRoutingModule } from './staff.routing.module';
import { StaffAddComponent } from './staff-add/staff-add.component';
import { NewPatientModule } from '../patient/newPatient.module';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
import { StaffAddressComponent } from './staff-address/staff-address.component';
import { staffEducationComponent} from'./staff-education/staff-education.component'
import { staffWorkComponent } from './staff-work/staff-work.component'; 
import { staffFamilyComponent } from './staff-family/staff-family.component';
import { staffCampusComponent } from './staff-campus/staff-campus.component';
import { staffHobbyComponent } from './staff-hobby/staff-hobby.component';
import { staffLanguageComponent } from './staff-language/staff-language.component';
import { StaffCardComponent } from './staff-card/staff-card.component';
//import { staffCardComponent } from './staff-card/staff-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    StaffRoutingModule,
    NewPatientModule,
  ],

  declarations: [
    StaffListComponent,
    StaffHomeComponent,
    StaffAddComponent,
    StaffCardComponent,
    StaffEditComponent,
    StaffAddressComponent,
    staffEducationComponent,
    staffWorkComponent,
    staffFamilyComponent,
    staffLanguageComponent,
    staffCampusComponent,
    staffHobbyComponent,
  ],

  entryComponents: [
    StaffAddressComponent,
    staffEducationComponent,
    staffWorkComponent,
    staffFamilyComponent,
    staffLanguageComponent,
    staffCampusComponent,
    staffHobbyComponent,
  
  ],

  exports: [],

  providers: [],
})
export class StaffModule { 

  constructor(){
    sessionStorage.clear();
  }

}
