import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { BillingPaymentRefundModel } from '../models/BillingPaymentRefundModel';
import { BillingPaymentRefundSearchModel } from '../models/BillingPaymentRefundSearchModel';
import { billingService } from '../billing.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../core/util.service';
@Component({
  selector: 'app-billingHome',
  templateUrl: './billingPayment-refund.component.html',
  styleUrls: ['./billingPayment-refund.component.css']
})

export class BillingPaymentRefundComponent implements OnInit {

  //#region Property Declaration
  searchForm: FormGroup;
  searchModel: BillingPaymentRefundSearchModel = new BillingPaymentRefundSearchModel();
  BillingPaymentRefundModel: BillingPaymentRefundModel = new BillingPaymentRefundModel();
  paymentRefundDataDeltails: any;
  patientSearchId: any;
  patient: any;
  receiptNo: any;
  searchlist: any;
  patientID: any;
  show: boolean = false;
  paymentRefund: any;
  billlingPaymentCollection: any = [];
  IsDateCorect: boolean = false
  //#endregion Property Declaration

  //#region Constructor
  constructor(private customHttpSvc: CustomHttpService, private util: UtilService, private billingservice: billingService, public fb: FormBuilder,) { }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.searchForm = this.fb.group({
      FromDate: [new Date()],
      ToDate: [new Date()],
      PatientName: [""],
      ReceiptNo: [""],
      paymentRefundItem: this.fb.array([this.paymentRefundDynamicControls()])

    });
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.SearchDetails();
    this.getpatient();
    this.getReceiptNo();
    this.CheckValidDate();
  }
  //#endregion

  //#region DynamicControls
  paymentRefundDynamicControls() {
    return this.fb.group({
      Action: [""],
      ReceiptDate: [""],
      ReceiptTime: [""],
      ReceiptNumber: [""],
      Particulars: [""],
      AmountPaid: [""],
      Discount: [""],
      Notes: [""],
      RefundAmount: [""],
      RefundNotes: [""],
    });
  }

  get paymentRefundItemsControl() {
    return <FormArray>this.searchForm.get('paymentRefundItem');
  }
  getDynamicControl() {
    return <FormArray>this.searchForm.get('paymentRefundItem');
    }
  //#endregion

  //setPatientSearchId(number) {
  //  this.patientSearchId = number;
  //}

  //#region SearchDetails
  SearchDetails() {
 
    this.searchModel.FromDate = this.searchForm.get('FromDate').value;
    this.searchModel.ToDate = this.searchForm.get('ToDate').value; 
    this.searchModel.receiptNo = this.searchForm.get('ReceiptNo').value;
    this.searchModel.PatientId = this.patientID;
    this.billingservice.searchAdmission(this.searchModel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show = false;
      }
      else {
        this.paymentRefundDataDeltails = this.searchlist;
        this.setDetails();
        this.show = true;
      }
    })
  }
  //#endregion

  //#region clear Details
  clearsearch() {
    this.searchForm.reset();
    this.searchForm.get('FromDate').setValue(new Date());
    this.searchForm.get('ToDate').setValue(new Date());
    this.searchModel.FromDate = this.searchForm.get('FromDate').value;
    this.searchModel.ToDate = this.searchForm.get('ToDate').value;
    this.searchModel.receiptNo = "";
    this.searchModel.PatientId = 0;
    this.billingservice.searchAdmission(this.searchModel).then(res => {
      this.searchlist = res;
      if (this.searchlist.length == 0) {
        this.show = false;
        this.patientID = 0;
        this.searchModel.receiptNo = "";
      }
      else {
        this.paymentRefundDataDeltails = this.searchlist;
        this.show = true;
        this.patientID = 0;
       this.searchModel.receiptNo = "";
       this.setDetails();
      }
    })
  }
 //#endregion

  //#region setDetails
  setDetails() {
    if (this.paymentRefundDataDeltails.length != 0) {
      this.show = true;
      {
        this.paymentRefundItemsControl.clear();
        for (let i = 0; i < this.paymentRefundDataDeltails.length; i++) {
          this.paymentRefundItemsControl.push(this.paymentRefundDynamicControls());
          const paymentRefundControl = <FormArray>this.searchForm.controls['paymentRefundItem'];
          paymentRefundControl.controls[i].get('ReceiptDate').setValue(new Date(this.paymentRefundDataDeltails[i].ReceiptDate).toLocaleDateString());
          paymentRefundControl.controls[i].get('ReceiptTime').setValue(new Date(this.paymentRefundDataDeltails[i].ReceiptDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
          paymentRefundControl.controls[i].get('ReceiptNumber').setValue(this.paymentRefundDataDeltails[i].ReceiptNo);
          paymentRefundControl.controls[i].get('Particulars').setValue(this.paymentRefundDataDeltails[i].billingParticular);
          paymentRefundControl.controls[i].get('AmountPaid').setValue(this.paymentRefundDataDeltails[i].AmountPaid);
          paymentRefundControl.controls[i].get('Discount').setValue(this.paymentRefundDataDeltails[i].DiscountAmount);
          paymentRefundControl.controls[i].get('Notes').setValue(this.paymentRefundDataDeltails[i].Notes);
          paymentRefundControl.controls[i].get('RefundAmount').setValue(this.paymentRefundDataDeltails[i].Refund);
          paymentRefundControl.controls[i].get('RefundNotes').setValue(this.paymentRefundDataDeltails[i].RefundNotes);
          this.paymentRefundItemsControl.removeAt(this.paymentRefundDataDeltails.length);
        }
      }
    }
    else {
      this.paymentRefundItemsControl.removeAt(0);
      this.show = false;
    }
  }
  //#endregion

  //#region save
  saveBillingRefund() {
    const billingRefund = <FormArray>this.searchForm.controls['paymentRefundItem'];
    for (let i = 0; i < billingRefund.length; i++) {
      this.paymentRefund = this.paymentRefundDataDeltails[i];
      if (billingRefund.controls[i].get('Action').value == true) {
        this.BillingPaymentRefundModel = new BillingPaymentRefundModel();
        this.BillingPaymentRefundModel.VisitPaymentDetailsID = this.paymentRefund.VisitPaymentDetailsID;
        this.BillingPaymentRefundModel.AdmissionPaymentDetailsID = this.paymentRefund.AdmissionPaymentDetailsID;
        this.BillingPaymentRefundModel.Refund = parseInt(billingRefund.controls[i].get('RefundAmount').value);
        this.BillingPaymentRefundModel.RefundNotes = billingRefund.controls[i].get('RefundNotes').value;
        this.billlingPaymentCollection.push(this.BillingPaymentRefundModel);
      }
    }
        if (this.billlingPaymentCollection.length != 0) {
          this.billingservice.saveBillingPayment(this.billlingPaymentCollection).then(data => {
            if (data != null) {
              this.util.showMessage('', 'Billing Payment Refund  Details saved successfully',BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
                this.billlingPaymentCollection = [];
                this.SearchDetails();
                  //this.searchForm.reset();
                  //this.searchForm.get('FromDate').setValue(new Date());
                  //this.searchForm.get('ToDate').setValue(new Date());
                  //this.setDetails();
                //this.clearsearch();
                });
            } 
         });
        } else {
          this.util.showMessage('', 'Please Select any one record', BMSMessageBoxColorMode.Warning, BMSMessageBoxMode.MessageBox).then((res) => {
            //this.searchform.reset();
            //this.searchform.get('fromdate').setvalue(new date());
            //this.searchform.get('todate').setvalue(new date());
          // this.setdetails();
          //  this.clearsearch();
            this.SearchDetails();
          });
        }
  }
  //#endregion

  //#region clear
  clearBillingRefund() {
    this.searchForm.reset();
    this.clearsearch();
    this.searchForm.get('FromDate').setValue(new Date());
    this.searchForm.get('ToDate').setValue(new Date());
  }
  //#endregion


  //onBillingRefund(i) {
  //}

  //#region Set Patient id
 setpatient(value1) {
   this.patientID = value1;
  }
   //#endregion

  // #region "Patient"
  getpatient() {
    if (this.searchForm.get('PatientName').value != null) {
      this.searchForm.get('PatientName').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.billingservice.getAllPatientData(key).then(data => {
                this.patient = data;
              })
            }
            else {
              this.patient = null;
            }
          }
        })
    }
  }
  //#endregion

  // #region "ReceiptNo"
  getReceiptNo() {
    if (this.searchForm.get('ReceiptNo').value != null) {
      this.searchForm.get('ReceiptNo').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.billingservice.getReceiptNo(key).then(data => {
              this.receiptNo = data;
            })
          }
          else{
            this.receiptNo = null;

          }
        }
        else {
          this.receiptNo = null;
        }
      })
    }
  }
  //#endregion

  //#region  Check ValidDate
  CheckValidDate() {
    
    this.searchForm.get('FromDate').valueChanges.subscribe((FromDate: any) => {      
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {       
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });

    this.searchForm.get('ToDate').valueChanges.subscribe((FromDate: any) => {    
      if (this.searchForm.get('FromDate').value > this.searchForm.get('ToDate').value) {  
        this.IsDateCorect = true;
      } else {
        this.IsDateCorect = false;
      }
    });
  }
 //#endregion

}


