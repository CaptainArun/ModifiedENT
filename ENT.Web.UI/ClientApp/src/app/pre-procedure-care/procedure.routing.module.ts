import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DrugchartAddListComponent } from "././pre-procedure-care/drug-chart/drug-add-list/drugchart-add-list.component";
import { PreProcedureCareComponent } from "./pre-procedure-care/pre-procedure-care.component";
import { ProcedureHomeComponent } from "./procedure-home.component";
import { administrationDrugChart } from './pre-procedure-care/administration-drug-chart/administration-drug-chart.component';

export const routes: Routes = [
  {
   path: "",
    component: ProcedureHomeComponent,

    children: [
      { path: "pre-procedure-list", component: PreProcedureCareComponent },

      { path: "drugAdministrationChart/:patientid/:AdmissionID", component: administrationDrugChart },

      { path: "DrugchartAddListComponent/:patientid/:AdmissionID", component: DrugchartAddListComponent },
     
      { path: '', component: PreProcedureCareComponent },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreprocedureRoutingModule {}
