import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { billingHomeComponent } from "./billing-home/billing-home.component";
import { BillingledgerDetailsComponent } from "./billing-payment-ledgerDetails/billingPayment-ledgerDetails.component";
import { billingMasterComponent } from "./billing-payment-master/billing-master/billing-master.component";
import { BillingSetupComponent } from "./billing-payment-master/setup/billing-setup.component";
//import { BillingComponent } from "./billing.component";
import { MasterBillingPaymentComponent } from "./masterBilling-payment/masterBilling-Payment";
import { BillingPaymentRefundComponent } from './billing-payment-refund/billingPayment-refund.component';
import { BillingPaymentComponent } from "./billing-payment-master/billingPayment-master.component";


export const routes: Routes = [
     {
       path: "",component:billingHomeComponent ,
       children: [
        { path: 'billing', component:BillingPaymentComponent},
        { path: 'masterbillingPayments', component: MasterBillingPaymentComponent }, 
        { path: 'billingPaymentRefund', component: BillingPaymentRefundComponent},
        { path: 'billingledgerDetails', component: BillingledgerDetailsComponent},
        { path: 'billingMaster&submaster', component: billingMasterComponent }, 
        { path: 'billingSetup', component: BillingSetupComponent }, 
        { path: '', component: BillingPaymentComponent }
      ],
     },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class billingRoutingModule {}


