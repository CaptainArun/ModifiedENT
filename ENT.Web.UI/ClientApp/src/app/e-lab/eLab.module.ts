import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModuleControls } from "../material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { BMSTableModule } from "../ux/bmstable/bms-table.module";
import { eLabService } from "./eLab.service";
import { eLabComponent } from "./eLab/eLab.component";
import { eLabHomeComponent } from "./eLab-home.component";
import { eLabRoutingModule } from "./eLab.routing.module";
import { eLabUpdateReportComponent } from "./eLab/eLab-update-report/eLab-update-report.component";
import { eMailComponent } from "./eLab/eLab-eMail/eLab-eMail.component";
import { LabMasterComponent } from "./eLab-billing/lab-master/lab-master.component";
import { AddElabMasterComponent } from "./eLab-billing/lab-master/add-Lab-master/add-lab-master.component";
import { EditLabMasterComponent } from "./eLab-billing/lab-master/edit-lab-master/edit-lab-master.component";
import { ViewLabMasterComponent } from "./eLab-billing/lab-master/view-lab-master/view-lab-master.component";
import { LabSubMasterComponent } from "./eLab-billing/lab-sub-master/lab-sub-master.component";
import { AddElabSubMasterComponent } from "./eLab-billing/lab-sub-master/add-Lab-submaster/add-lab-submaster.component";
import { ViewLabSubMasterComponent } from "./eLab-billing/lab-sub-master/view-lab-submaster/view-lab-submaster.component";
import { EditLabSubMasterComponent } from "./eLab-billing/lab-sub-master/edit-lab-submaster/edit-lab-submaster.component";
import { ElabSetupComponent } from "./eLab-setup/elab-setup.component";
import { AddElabSetupComponent } from "./eLab-setup/add-eLab-setup/add-eLab-setup.component";
import { ViewElabSetupComponent } from "./eLab-setup/view-eLab-setup/view-eLab-setup.component";
import { EditElabSetupComponent } from "./eLab-setup/edit-eLab-setup/edit-eLab-setup.component";
import { ELabBillingComponent } from "./eLab-billing/eLab-billing.component";
import { NewPatientModule } from "../patient/newPatient.module";
import { eLabNewRequestComponent } from "./eLab/eLab-new-request/eLab-new-request-add-view.component";
import { eLabNewRequestEditComponent } from "./eLab/eLab-new-request/eLab-request -edit/eLab-request-edit.component";
import { eLabNewRequestViewComponent } from "./eLab/eLab-new-request/eLab-request -View/eLab-request-view.component";
import { eLabOrderEditComponent } from "./eLab/eLab-order-edit/eLab-order-edit.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleControls,
    NgxMaterialTimepickerModule,
    BMSTableModule,
    eLabRoutingModule,
    NewPatientModule,
  ],
  declarations: [
    eLabComponent,
    eLabHomeComponent,
    eLabNewRequestComponent,
    eLabUpdateReportComponent,
    eMailComponent,
    eLabNewRequestEditComponent,
    eLabNewRequestViewComponent,
    eLabOrderEditComponent,

    // //new billing
    LabMasterComponent,
    AddElabMasterComponent,
    EditLabMasterComponent,
    ViewLabMasterComponent,

    LabSubMasterComponent,
    AddElabSubMasterComponent,
    ViewLabSubMasterComponent,
    EditLabSubMasterComponent,
    ElabSetupComponent,
    AddElabSetupComponent,
    ViewElabSetupComponent,
    EditElabSetupComponent,
    ELabBillingComponent,
  ],
  entryComponents: [
    eLabNewRequestComponent,
    eLabUpdateReportComponent,
    eMailComponent,
    eLabNewRequestEditComponent,
    eLabNewRequestViewComponent,
    eLabOrderEditComponent,
    // billing
    AddElabMasterComponent,
    EditLabMasterComponent,
    ViewLabMasterComponent,
    AddElabSubMasterComponent,
    ViewLabSubMasterComponent,
    EditLabSubMasterComponent,
    AddElabSetupComponent,
    ViewElabSetupComponent,
    EditElabSetupComponent,
  ],
  exports: [],
  providers: [eLabService],
})
export class eLabModule {
  constructor(){
   sessionStorage.clear();   
  } 
 }