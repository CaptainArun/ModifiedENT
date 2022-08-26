import { VisitPaymentDetailsModel } from './VisitPaymentDetailsModel';

 export class VisitPaymentModel {
   VisitPaymentID: number;
   VisitID: number;
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
   paymentDetailsItem: VisitPaymentDetailsModel[];
}
