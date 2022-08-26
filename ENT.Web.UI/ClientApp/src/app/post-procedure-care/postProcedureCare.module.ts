import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  RadioControlValueAccessor,
} from "@angular/forms";
import { MaterialModuleControls } from "../material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { PostProcedureRoutingModule } from "././postProcedureCare.routing.module";
import { PostProcedureCareService } from "../post-procedure-care/postProcedureCare.service";
import { DrugchartAddListComponent } from "../post-procedure-care/post-procedure-care/drug-chart/drug-add-list/drugchart-add-list.component";
import { DrugchartViewRecordComponent } from "../post-procedure-care/post-procedure-care/drug-chart/drug-view-record/drugchart-view-record.component";
import { DrugCharteditRecordComponent } from "../post-procedure-care/post-procedure-care/drug-chart/drug-edit-record/drugchart-edit-record.component";

import { BMSTableModule } from "../ux/bmstable/bms-table.module";
import { PostProcedureHomeComponent } from './post-procedure-care-home.component';
import { postProcedureCareList } from './post-procedure-care/post-procedure-care-list.component';
import { PostProcedureAddComponent } from './post-procedure-care/post-procedure-add/post-procedure-add.component';
import { postProcedureAdministrationDrugChart } from "../post-procedure-care/post-procedure-care/administration-drug-chart/administration-drug-chart.component";
import { NewPatientModule } from "../patient/newPatient.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    PostProcedureRoutingModule,
    NewPatientModule,
  ],

  declarations: [
    // Extra


   DrugchartAddListComponent,
    DrugchartViewRecordComponent,
    DrugCharteditRecordComponent,
    PostProcedureHomeComponent,
    postProcedureCareList,
    PostProcedureAddComponent,
    postProcedureAdministrationDrugChart,
    postProcedureCareList,

  ],

  entryComponents: [
    DrugchartAddListComponent,
    DrugchartViewRecordComponent,
    DrugCharteditRecordComponent,
    PostProcedureAddComponent,
    postProcedureAdministrationDrugChart,

  ],

  exports: [],

  providers: [PostProcedureCareService],
})
export class PostProcedureModule {

  constructor(){
    sessionStorage.clear();   
  }
  
}
