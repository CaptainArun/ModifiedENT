import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DrugchartAddListComponent } from "../post-procedure-care/post-procedure-care/drug-chart/drug-add-list/drugchart-add-list.component";
import { postProcedureCareList } from '../post-procedure-care/post-procedure-care/post-procedure-care-list.component';
import { PostProcedureHomeComponent } from './post-procedure-care-home.component';
import { postProcedureAdministrationDrugChart } from '../post-procedure-care/post-procedure-care/administration-drug-chart/administration-drug-chart.component';
import { PostProcedureAddComponent } from "./post-procedure-care/post-procedure-add/post-procedure-add.component";

export const routes: Routes = [
  {
    path: "",
    component: PostProcedureHomeComponent,
   
    children: [
      { path: "postprocedureDrugchart/:PatientId/:AdmissionID", component: DrugchartAddListComponent },
      { path: 'post-procedure-care', component: postProcedureCareList }, 
      { path: 'postprocedureAdministration/:PatientId/:AdmissionID', component: postProcedureAdministrationDrugChart }, 

      { path: "postProcedureCasesheet/:PatientId/:AdmissionID/:preprocedureid", component: PostProcedureAddComponent },


      { path: '', component: postProcedureCareList },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostProcedureRoutingModule {}
