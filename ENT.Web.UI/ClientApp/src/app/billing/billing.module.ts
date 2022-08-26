import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule,  ReactiveFormsModule} from "@angular/forms";
import { MaterialModuleControls } from "../material.module";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { BMSTableModule } from "../ux/bmstable/bms-table.module";

import { NewPatientModule } from '../patient/newPatient.module';
import { billingService } from "./billing.service";
import { billingRoutingModule } from "./billing.routing.module";
import { billingHomeComponent } from "./billing-home/billing-home.component";
import { billingMasterComponent } from "./billing-payment-master/billing-master/billing-master.component";
import { AddBillingMasterComponent } from "./billing-payment-master/billing-master/add-billing-master/add-billing-master.component";
import { EditBillingMasterComponent } from "./billing-payment-master/billing-master/edit-billing-master/edit-billing-master.component";
import { ViewBillingMasterComponent } from "./billing-payment-master/billing-master/view-billing-master/view-billing-master.component";
import { AddBillingSubMasterComponent } from "./billing-payment-master/billing-sub-master/add-billing-submaster/add-billing-submaster.component";
import { BillingSubMasterComponent } from "./billing-payment-master/billing-sub-master/billing-sub-master.component";
import { EditBillingSubMasterComponent } from "./billing-payment-master/billing-sub-master/edit-lab-submaster/edit-billing-submaster.component";
import { ViewBillingSubMasterComponent } from "./billing-payment-master/billing-sub-master/view-lab-submaster/view-billing-submaster.component";
import { AddbillingSetupComponent } from "./billing-payment-master/setup/add-billing-setup/add-billing-setup.component";
import { BillingSetupComponent } from "./billing-payment-master/setup/billing-setup.component";
import { EditBillingSetupComponent } from "./billing-payment-master/setup/edit-billing-setup/edit-billing-setup.component";
import { ViewBillingSetupComponent } from "./billing-payment-master/setup/view-billing-setup/view-billing-setup.component";
import { BillingPaymentComponent } from "./billing-payment-master/billingPayment-master.component";
import { MasterBillingPaymentComponent } from "./masterBilling-payment/masterBilling-Payment";
import { BillingComponent } from "./billing.component";

import { BillingledgerDetailsComponent } from "./billing-payment-ledgerDetails/billingPayment-ledgerDetails.component";
import { BillingPaymentRefundComponent } from './billing-payment-refund/billingPayment-refund.component';
import { MasterBillingEditPaymentComponent } from "./masterBilling-payment/masterBilling-payment-edit/masterBilling-EditPayment";
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      billingRoutingModule,
      MaterialModuleControls,
      NgxMaterialTimepickerModule,
      BMSTableModule,
      NewPatientModule,
          ],
  
    declarations: [ 
      BillingComponent,
      billingHomeComponent,
      BillingPaymentComponent,
      
      billingMasterComponent,
      AddBillingMasterComponent,
      EditBillingMasterComponent,
      ViewBillingMasterComponent,

      BillingSubMasterComponent,
      AddBillingSubMasterComponent,
      EditBillingSubMasterComponent,
      ViewBillingSubMasterComponent,

      BillingSetupComponent,
      AddbillingSetupComponent,
      EditBillingSetupComponent,
      ViewBillingSetupComponent,

      MasterBillingPaymentComponent,
      MasterBillingEditPaymentComponent,
      BillingPaymentRefundComponent,
      BillingledgerDetailsComponent
    ],
  
    entryComponents: [
      AddBillingMasterComponent,
      EditBillingMasterComponent,
      ViewBillingMasterComponent,
      
      AddBillingSubMasterComponent,
      EditBillingSubMasterComponent,
      ViewBillingSubMasterComponent,
    
      AddbillingSetupComponent,
      EditBillingSetupComponent,
      ViewBillingSetupComponent,
      MasterBillingEditPaymentComponent,

    ],
  
    exports: [],
  
    providers: [billingService],
  })
  export class billingModule {
    constructor(){
      sessionStorage.clear();   
    } 
  }
