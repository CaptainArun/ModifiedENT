import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { UtilService } from 'src/app/core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from 'src/app/ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from 'src/app/ux/columnConfig';
import { billingService } from '../billing.service';
import { MasterBillingPaymentComponent } from '../masterBilling-payment/masterBilling-Payment';
import { MasterBillingEditPaymentComponent } from '../masterBilling-payment/masterBilling-payment-edit/masterBilling-EditPayment';

@Component({
  selector: 'app-billingPayment-master',
  templateUrl: './billingPayment-master.component.html',
  styleUrls: ['./billingPayment-master.component.css']
})
export class BillingPaymentComponent implements OnInit {

 //#region "Property Declaration"
 tableConfig: TableConfig = new TableConfig;
 allPaymentList: any;
 //#endregion

//#region "constructor"
 constructor(public custHttp: CustomHttpService, public dialog: MatDialog, private billingSvc: billingService,private util: UtilService) {

   this.tableConfig.showPagination = true;
   this.tableConfig.showView = true;
   this.tableConfig.showIcon = false;
   this.tableConfig.showEdit = true;
   this.tableConfig.showAdd = false;
   this.tableConfig.showDelete = true;
   this.tableConfig.columnConfig = [
     { PropertyName: 'ReceiptNo', DisplayName: 'Receipt Number', DisplayMode: 'Text', LinkUrl: '' ,width:'8%'},
     { PropertyName: 'ReceiptDate', DisplayName: 'Receipt Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: '' ,width:'' },
     { PropertyName: 'AdmissionDateandTime', DisplayName: 'Visit Date & Time / Admission Date', DisplayMode: "Text", LinkUrl: '' ,width:'10%' },
     { PropertyName: 'PatientName', DisplayName: 'Patient Name', DisplayMode: 'Text', LinkUrl: '' ,width:'' },
     { PropertyName: 'BillNo', DisplayName: 'Bill No', DisplayMode: 'Text', LinkUrl: '' ,width:'' },
     { PropertyName: 'PaymentMode', DisplayName: 'Payment Mode', DisplayMode: 'Text', LinkUrl: '' ,width:'' },
     { PropertyName: 'PaidAmount', DisplayName: 'Amount Paid(NR)', DisplayMode: 'Text', LinkUrl: '' ,width:'' },
     { PropertyName: 'Notes', DisplayName: 'Notes', DisplayMode: 'Text', LinkUrl: '' ,width:'' },
     { PropertyName: 'CreatedDate', DisplayName: 'Created Date', DisplayMode: "DateTime", FormatString: "dd-MM-yyyy", LinkUrl: ''  ,width:''},
     { PropertyName: 'CreatedBy', DisplayName: 'Created By', DisplayMode: 'Text', LinkUrl: '' ,width:'' },

   ];

 }
//#endregion

//#region "ngOnInit"
 ngOnInit() {
   this.custHttp.getDbName(localStorage.getItem('DatabaseName'));
   this.getBillingPaymentGridDetails();
 }
//#endregion

//#region "onBindItem"
onBindItem(event: any) {
 // if (event.Item) {
 //   if (event.Item.AdmissionDateandTime != null && event.Item.AdmissionDateandTime != undefined) {
 //     event.Item.AdmissionDateandTime = event.Item.AdmissionDateandTime;
 //   }
 //   else {
 //     event.Item.AdmissionDateandTime = event.Item.VisitDateandTime;
 //   }
 // }
 (event.Item.AdmissionDateandTime != null && event.Item.AdmissionDateandTime != undefined) ? event.Item.AdmissionDateandTime : event.Item.AdmissionDateandTime = event.Item.VisitDateandTime;

}
 //#endregion

 //#region "getBillingPaymentGridDetails"
 getBillingPaymentGridDetails() {
   this.billingSvc.getBillingPaymentGridDetails().then(res => {
     this.allPaymentList = res;
   });
 }
//#endregion

  //#region "addPatient"
 addPatient() {
   const viewDetails = this.dialog.open(MasterBillingPaymentComponent, {
     height: 'auto',
     width: 'auto',
     autoFocus: false,
   });
   viewDetails.afterClosed().subscribe(result => {
     if (result == "updated") {
       this.getBillingPaymentGridDetails();
     }
   })
 }
//#endregion

 //#region "openEditBillingPaymentRecord"
 openEditBillingPaymentRecord(event) {

   if (event.Item.VisitPaymentID !== 0 && event.Item.VisitPaymentID != null && event.Item.VisitPaymentID !== undefined) {

     this.billingSvc.GetVisitPaymentRecordbyID(event.Item.VisitPaymentID).then(data => {
       let patientDetailVisitPayment = data;
       patientDetailVisitPayment.billType = "Visit"
       const dialogRef = this.dialog.open(MasterBillingEditPaymentComponent, {
         data: patientDetailVisitPayment,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
       });
       dialogRef.afterClosed().subscribe(result => {
         if (result == "updated") {
           this.getBillingPaymentGridDetails();
         }
       });
     });
   }
   if (event.Item.AdmissionPaymentID != 0 && event.Item.AdmissionPaymentID != null && event.Item.AdmissionPaymentID) {
     this.billingSvc.GetAdmissionPaymentRecordbyID(event.Item.AdmissionPaymentID).then(data => {
      let patientDetailAdmissionPayment = data;
       patientDetailAdmissionPayment.billType = "Admission"
       const dialogRef = this.dialog.open(MasterBillingEditPaymentComponent, {
         data: patientDetailAdmissionPayment,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
       });
       dialogRef.afterClosed().subscribe(result => {
         if (result == "updated") {
           this.getBillingPaymentGridDetails();
         }
       });
     });
   }
 }
 //#endregion

 //#region "openVisitViewReport"
 openVisitViewReport(event) {
   if (event.Item.VisitPaymentID !== 0 && event.Item.VisitPaymentID != null && event.Item.VisitPaymentID !== undefined) {
     this.billingSvc.GetVisitPaymentRecordbyID(event.Item.VisitPaymentID).then(data => {
       let patientDetailVisitPayment = data;
       patientDetailVisitPayment.billType = "Visit";
       patientDetailVisitPayment.showView = "View";
       const dialogRef = this.dialog.open(MasterBillingEditPaymentComponent, {
         data: patientDetailVisitPayment,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
       });
       dialogRef.afterClosed().subscribe(result => {
         if (result == "update") {
           this.getBillingPaymentGridDetails();
         }
       });
     });
   }
   if (event.Item.AdmissionPaymentID != 0 && event.Item.AdmissionPaymentID != null && event.Item.AdmissionPaymentID) {
     this.billingSvc.GetAdmissionPaymentRecordbyID(event.Item.AdmissionPaymentID).then(data => {
       let patientDetailAdmissionPayment = data;
       patientDetailAdmissionPayment.billType = "Admission";
       patientDetailAdmissionPayment.showView = "View";
       const dialogRef = this.dialog.open(MasterBillingEditPaymentComponent, {
         data: patientDetailAdmissionPayment,
         height: 'auto',
         width: 'auto',
         autoFocus: false,
       });
       dialogRef.afterClosed().subscribe(result => {
         if (result == "update") {
           this.getBillingPaymentGridDetails();
         }
       });
     });
   }
 }
   //#endregion

  //#region "DeleteRecord"
 DeleteRecord(event: any) {
 if (event.Item.VisitPaymentID !== 0 && event.Item.VisitPaymentID != null && event.Item.VisitPaymentID !== undefined) {
   this.billingSvc.DeleteVisitPaymentRecord(event.Item.VisitPaymentID).then(data => {
     this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
       (res) => {
         if (res === true) {
           this.getBillingPaymentGridDetails();
         }
        });
   });
 }
 if (event.Item.AdmissionPaymentID != 0 && event.Item.AdmissionPaymentID != null && event.Item.AdmissionPaymentID) {

     this.billingSvc.DeleteAdmissionPaymentRecord(event.Item.AdmissionPaymentID).then(data => {
     this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
       (res) => {
         if (res === true) {
           this.getBillingPaymentGridDetails();
         }
        });
   });
 }
 }
 //#endregion
}
