import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MaterialModuleControls } from "../material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { PreprocedureRoutingModule } from "././procedure.routing.module";
import { ProcedureService } from "./procedure.service";
import { DrugchartAddListComponent } from "./pre-procedure-care/drug-chart/drug-add-list/drugchart-add-list.component";
import { DrugchartViewRecordComponent } from "./pre-procedure-care/drug-chart/drug-view-record/drugchart-view-record.component";
import { NewPatientModule } from "../patient/newPatient.module";
import { BMSTableModule } from "../ux/bmstable/bms-table.module";
import { PreProcedureCareComponent } from "./pre-procedure-care/pre-procedure-care.component";
import { administrationDrugChart } from "./pre-procedure-care/administration-drug-chart/administration-drug-chart.component";
import { ProcedureHomeComponent } from "./procedure-home.component";
import { DrugCharteditRecordComponent } from "./pre-procedure-care/drug-chart/drug-edit-record/drugchart-edit-record.component";
import { PreAnethesiaViewComponent } from './pre-procedure-care/schedule-procedure/pre-anethesia-view.component';
import { PreProcedureAnsthesiaComponent } from './pre-procedure-care/anaesthesia-fittness-clearance/pre-procedure-ansthesia.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    PreprocedureRoutingModule,
    NewPatientModule,
  ],

  declarations: [
    // Extra
    DrugchartAddListComponent,
    DrugchartViewRecordComponent,
    DrugCharteditRecordComponent,

    //preprocedure
    PreProcedureCareComponent,
    PreAnethesiaViewComponent,
    PreProcedureAnsthesiaComponent,
    administrationDrugChart,
    ProcedureHomeComponent
  ],

  entryComponents: [
    DrugchartAddListComponent,
    DrugchartViewRecordComponent,
    DrugCharteditRecordComponent,
    //preprocedure
    PreProcedureCareComponent,
    PreAnethesiaViewComponent,
    PreProcedureAnsthesiaComponent,
    administrationDrugChart,
    ProcedureHomeComponent
  ],

  exports: [],

  providers: [ProcedureService],
})
export class ProcedureModule {

  constructor(){
    sessionStorage.clear();   
  }
  
}
