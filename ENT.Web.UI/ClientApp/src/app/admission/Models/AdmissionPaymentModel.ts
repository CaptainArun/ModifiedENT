import { AdmisssionPaymentDetailsModel } from "./AdmissionPaymentDetailsModel";

 export class AdmissionPaymentModel {
        AdmissionPaymentID : number;
        AdmissionID : number;
        ReceiptNo : string;
        ReceiptDate : Date;
        BillNo : string;
        MiscAmount:number ;
        DiscountPercentage : number;
        DiscountAmount:number ;
        GrandTotal:number;
        NetAmount:number ;
        PaidAmount :number;
        PaymentMode : string;
        Notes : string;
        paymentDetailsItem :AdmisssionPaymentDetailsModel[];

        
        

 }