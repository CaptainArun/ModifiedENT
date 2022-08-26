import { MasterBillingPaymentDetailsModel } from "./MasterBillingPaymentDetailsModel";

 export class MasterBillingPaymentModel {
   VisitPaymentID: number;
   VisitID: number;
   AdmissionID:number;
   ReceiptNo: string;
   ReceiptDate: Date;
   BillNo: string;
   MiscAmount: number;
   DiscountPercentage:number;
   DiscountAmount: number;
   GrandTotal: number;
   NetAmount: number;
   PaidAmount: number;
   PaymentMode: string;
   Notes: string;
   paymentDetailsItem: MasterBillingPaymentDetailsModel[];
   BillingTypeName: string; 
}
