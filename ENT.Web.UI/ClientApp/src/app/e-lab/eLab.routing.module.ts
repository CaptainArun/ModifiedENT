import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LabMasterComponent } from "./eLab-billing/lab-master/lab-master.component";
import { eLabHomeComponent } from "./eLab-home.component";
import { ElabSetupComponent } from "./eLab-setup/elab-setup.component";
import { eLabComponent } from "./eLab/eLab.component";

export const routes: Routes = [
    {
      path: "",component: eLabHomeComponent ,
     
      children: [
        { path: 'e-lab', component: eLabComponent }, 
        { path: 'LabMaster', component: LabMasterComponent }, 
        { path: 'LabSetup', component: ElabSetupComponent }, 
        { path: '', component: eLabComponent }        
      ],
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class eLabRoutingModule {}