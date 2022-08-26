import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { VisitPaymentModel } from '../models/VisitPaymentModel';
import { CustomHttpService } from '../../core/custom-http.service';
import { VisitPaymentDetailsModel } from '../models/VisitPaymentDetailsModel';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../core/util.service';
import { MatDialog } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';


@Component({
  selector: 'app-visit-payment',
  templateUrl: './visit-payment.component.html',
  styleUrls: ['./visit-payment.component.css']
})

export class VisitPaymentComponent implements OnInit {

  //#region "Property Declaration"
  VisitPaymentForm: FormGroup;
  VisitPaymentModel: VisitPaymentModel = new VisitPaymentModel();
  rows: FormArray = this.fb.array([]);
  DepartmentInfo: any;
  MasterBillingTypInfo: any;
  BillingpartCharges: any;
  depCharges: any;
  ReceiptNo: any;
  totalCharges: any = 0;
  PaymentM: any;
  VisitPaymentId: any;
  totalInfo: any;
  hideButton: boolean = false;
  mismatch: boolean = true;
  GrandTotalfield: boolean;
  BillingParticularsName: any;
  SetupMasterID: any;
  PatientCardId: any;
  DepartmentitemNameList = [];
  BillingitemNameList = [];
  //#endregion

  //#region "constructor"
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private VisitPaymentService: VisitService, public customhttp: CustomHttpService, public dialog: MatDialog, private util: UtilService) {
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.VisitPaymentForm = this.fb.group({
      VisitID: [''],
      ReceiptNo: ['', Validators.required],
      ReceiptDate: [new Date(), Validators.required],
      BillNo: [''],
      MiscAmount: [''],
      DiscountPercentage: [''],
      DiscountAmount: [''],
      GrandTotal: [''],
      NetAmount: ['', Validators.required],
      PaidAmount: ['', Validators.required],
      PaymentMode: ['', Validators.required],
      Notes: [''],
      BillingParticularsubNumber: [""],
      GrandTotalshow: [''],
      paymentDetailsItem: VisitPaymentDetailsModel,
      rows: this.rows
    });

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.onAddRow();
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.GetPaymentTypeListforVisit();
    this.onsetdisableRow();

    this.activatedRoute.params.subscribe(params => {
      this.VisitPaymentId = params.id;
      this.PatientCardId = params.PatientId;
      if (this.VisitPaymentId != null && this.VisitPaymentId != undefined) {
        this.getVisitPaymentDetail();
      }
      else {
        this.VisitPaymentId = this.VisitPaymentService.visitPaymentVisitId;
      }
    });
  }
  //#endregion

  //#region "GetPaymentTypeListforVisit"
  GetPaymentTypeListforVisit() {
    this.VisitPaymentService.GetPaymentTypeListforVisit().then(data => {
      this.PaymentM = data;
    });
  }
  //#endregion

  //#region "getVisitPaymentDetail"
  getVisitPaymentDetail() {
    this.VisitPaymentService.visitPaymentDetail(this.VisitPaymentId).then(res => {
      this.totalInfo = this.VisitPaymentService.visitPaymentViewItem;
      if (this.totalInfo != null && this.totalInfo != undefined) {
        this.setValue(this.totalInfo);
      }
    });
  }
  //#endregion

  //#region "setValue"
  setValue(value1) {
    this.GrandTotalfield = true;
    this.VisitPaymentModel.paymentDetailsItem = [];
    const control = <FormArray>this.VisitPaymentForm.controls['rows'];
    for (let i = 0; i < value1.paymentDetailsItem.length; i++) {
      control.controls[i].get('Department').setValue(value1.paymentDetailsItem[i].DepartmentName);
      control.controls[i].get('Charges').setValue(value1.paymentDetailsItem[i].Charges.toFixed(2));
      control.controls[i].get('BillingParticularsubNumber').setValue(value1.paymentDetailsItem[i].Charges.toFixed(2));
      control.controls[i].get('BillingParticulars').setValue(value1.paymentDetailsItem[i].billingParticular);
      if (i < value1.paymentDetailsItem.length - 1) {
        this.onAddRow();
      }
    }
    this.VisitPaymentForm.get('ReceiptNo').setValue(value1.ReceiptNo);
    this.VisitPaymentForm.get('VisitID').setValue(value1.VisitID);
    this.VisitPaymentForm.get('ReceiptDate').setValue(value1.ReceiptDate);
    this.VisitPaymentForm.get('BillNo').setValue(value1.BillNo);
    this.VisitPaymentForm.get('MiscAmount').setValue(value1.MiscAmount.toFixed(2));
    this.VisitPaymentForm.get('DiscountPercentage').setValue(parseFloat(value1.DiscountPercentage == null ? 0 : value1.DiscountPercentage));
    this.VisitPaymentForm.get('DiscountAmount').setValue(value1.DiscountAmount);
    this.VisitPaymentForm.get('GrandTotalshow').setValue(value1.GrandTotal.toFixed(2));
    this.VisitPaymentForm.get('NetAmount').setValue(value1.NetAmount.toFixed(2));
    this.VisitPaymentForm.get('PaidAmount').setValue(value1.PaidAmount.toFixed(2));
    this.VisitPaymentForm.get('PaymentMode').setValue(value1.PaymentMode);
    this.VisitPaymentForm.get('Notes').setValue(value1.Notes);
    this.VisitPaymentForm.disable();
    this.hideButton = true;
  }
  //#endregion

  //#region "onAddRow"
  onAddRow() {
    this.rows.push(this.createItemFormGroup());
    this.calculateTotalCharges();
    this.DepartmentInfo = null;
    this.MasterBillingTypInfo = null;
    this.onsetdisableRow();

  }
  //#endregion
  onsetdisableRow() {
    const control = <FormArray>this.VisitPaymentForm.controls['rows'];
    for (let row of control.controls) {
      if (row.get('Department') != null && row.get('Department').value != undefined && row.get('Department').value != null && row.get('Department').value.length > 2) {
        row.get('BillingParticulars').enable();
      }
      else {
        row.get('BillingParticulars').disable();
        row.get('BillingParticulars').setValue("");
        row.get('Charges').setValue("");
      }
    }
  }

  //#region "onRemoveRow"
  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
    this.calculateTotalCharges();
  }
  //#endregion

  //#region "createItemFormGroup"
  createItemFormGroup(): FormGroup {
    return this.fb.group({
      Department: [null, Validators.required],
      BillingParticulars: [null, Validators.required],
      Charges: [null, Validators.required],
      DepartmentNumber: null,
      BillingParticularsubNumber: [null, Validators.required]
    });
  }
  //#endregion

  //#region "calculateTotalCharges"
  calculateTotalCharges() {
    this.totalCharges = Number(this.VisitPaymentForm.controls['MiscAmount'].value);
    const control = <FormArray>this.VisitPaymentForm.controls['rows'];
    for (let row of control.controls) {
      if (row.get('Charges') != null && row.get('Charges').value != undefined && row.get('Charges').value != null) {
        this.totalCharges = Number(this.totalCharges) + Number(row.get('Charges').value);
      }
    }
    this.totalCharges = this.totalCharges;
    this.calculateDiscount();
  }
  //#endregion

  //#region "calculateDiscount"
  calculateDiscount() {
    let totalValue: number = this.totalCharges;
    let discountPercentage: number = this.VisitPaymentForm.controls['DiscountPercentage'].value;
    let discountValue: number = (Number(discountPercentage) / 100) * totalValue;
    let netTotal: number = this.totalCharges - discountValue;
    this.VisitPaymentForm.controls['DiscountAmount'].setValue(discountValue);
    this.VisitPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.VisitPaymentForm.controls['PaidAmount'].setValue(null);
  }
  //#endregion

  //#region "calculateDiscountamount"
  calculateDiscountamount() {
    let totalValue: number = this.totalCharges;
    let DiscountAmount: number = this.VisitPaymentForm.controls['DiscountAmount'].value;
    let netTotal: number = totalValue - DiscountAmount;
    this.VisitPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.VisitPaymentForm.controls['PaidAmount'].setValue(null);
  }
  //#endregion

  //#region "amountAfterPaid"
  amountAfterPaid() {

    if (this.VisitPaymentForm.controls['PaidAmount'].value <= this.VisitPaymentForm.controls['NetAmount'].value) {
      this.mismatch = true;
    }
    else {
      this.mismatch = false;
    }
  }

  //#endregion

  //#region "GetDepartmentCodeList"
  GetDepartmentCodeList(index) {

    const control = <FormArray>this.VisitPaymentForm.controls['rows'];
    let key = control.controls[index].get('Department').value;
    if (key.length > 2 && key != null) {
      this.VisitPaymentService.GetDepartmentsfromMaster(key).then(data => {
        if (key.length > 2) {
          this.DepartmentInfo = data;
        }
        else {
          this.DepartmentInfo = null;
          this.MasterBillingTypInfo = null;
          this.onsetdisableRow();
        }
      });
    }
    else {
      this.DepartmentInfo = null;
      this.MasterBillingTypInfo = null;
      this.onsetdisableRow();
    }
  }
  //#endregion



  //#region "GetBillingtype"
  GetBillingtype(index) {
    const control = <FormArray>this.VisitPaymentForm.controls['rows'];
    let key = control.controls[index].get('BillingParticulars').value;
    if (key != null) {
      if (key.length > 2) {
        this.VisitPaymentService.GetbillingParticulars(control.controls[index].get('DepartmentNumber').value, key).then(data => {
          this.MasterBillingTypInfo = data;
          for (var i = 0; i < data.length; i++) {
            this.BillingpartCharges = this.MasterBillingTypInfo[i].Charges;
          }
        })
      }
      else {
        this.MasterBillingTypInfo = null;
      }
    }
    else {
      this.MasterBillingTypInfo = null;
    }
  }
  //#endregion

  // //#region "DepartmentId"
  // DepartmentId(DepartmentID,index) {
  //   (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
  //   this.onsetdisableRow();
  //   this.DepartmentInfo = null;
  // }
  // //#endregion

  // //#region "billingCharges"
  // billingCharges(BillingpartCharges: number, index: number, option) {
  //   this.SetupMasterID = option.SetupMasterID;
  //   this.BillingParticularsName = option.BillingParticulars;
  //   (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
  //   (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(this.SetupMasterID);
  //   this.calculateTotalCharges();
  //   this.MasterBillingTypInfo = null;
  // }
  // //#endregion

  //#region "GetReceiptNumber"
  GetReceiptNumber() {
    this.VisitPaymentService.GetReceiptNumber().then(res => {
      this.VisitPaymentForm.get('ReceiptNo').setValue(res[0]);
    })
  }
  //#endregion

  //#region "GetBillNumber"
  GetBillNumber() {

    this.VisitPaymentService.GetBillNumber().then(res => {
      this.VisitPaymentForm.get('BillNo').setValue(res[0]);
    })
  }
  //#endregion

  //#region "submitData"
  submitData() {
    if (this.VisitPaymentForm.valid) {

      this.VisitPaymentModel.paymentDetailsItem = [];

      const control = <FormArray>this.VisitPaymentForm.controls['rows'];

      for (let row of control.controls) {
        this.VisitPaymentModel.paymentDetailsItem.push(
          {
            Charges: row.get('Charges').value,
            SetupMasterID: row.get('BillingParticularsubNumber').value,
            VisitPaymentID: 0,
            Department: row.get('Department').value,
            BillingParticularsubNumber: row.get('BillingParticulars').value
          });
      }
      this.VisitPaymentModel.ReceiptNo = this.VisitPaymentForm.get('ReceiptNo').value;

      this.VisitPaymentModel.VisitID = this.VisitPaymentId;

      this.VisitPaymentModel.ReceiptDate = this.VisitPaymentForm.get('ReceiptDate').value;

      this.VisitPaymentModel.BillNo = this.VisitPaymentForm.get('BillNo').value;

      this.VisitPaymentModel.MiscAmount = Number(this.VisitPaymentForm.get('MiscAmount').value ? this.VisitPaymentForm.get('MiscAmount').value : 0);

      this.VisitPaymentModel.DiscountPercentage = parseFloat(this.VisitPaymentForm.get('DiscountPercentage').value);

      this.VisitPaymentModel.DiscountAmount = this.VisitPaymentForm.get('DiscountAmount').value ? this.VisitPaymentForm.get('DiscountAmount').value : 0;

      this.VisitPaymentModel.GrandTotal = this.totalCharges;

      this.VisitPaymentModel.NetAmount = this.VisitPaymentForm.get('NetAmount').value;

      this.VisitPaymentModel.PaidAmount = Number(this.VisitPaymentForm.get('PaidAmount').value);

      this.VisitPaymentModel.PaymentMode = this.VisitPaymentForm.get('PaymentMode').value;

      this.VisitPaymentModel.Notes = this.VisitPaymentForm.get('Notes').value;

      this.VisitPaymentService.AddUpdateVisitPayment(this.VisitPaymentModel).then(data => {
        this.util.showMessage('', 'Visit payment saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if (res === true) {
              this.router.navigate(['/home/visits']);
            }
          }
        );
      });
    }
  }
  //#endregion



  //#region "DepartmentId"
  DepartmentId(DepartmentDesc:any, DepartmentID:any, index:number) {
    (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
    this.DepartmentitemNameList[index] = DepartmentDesc;
    this.onsetdisableRow();
    this.DepartmentInfo = null;
  }
  //#endregion


  //#region "billingCharges"
  billingCharges(billingparticularDesc:any, BillingpartCharges: number, index: number, option) {
    this.SetupMasterID = option.SetupMasterID;
    this.BillingParticularsName = option.BillingParticulars;
    (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
    (<FormArray>this.VisitPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(this.SetupMasterID);
    this.BillingitemNameList[index] = billingparticularDesc;
    this.calculateTotalCharges();
    this.MasterBillingTypInfo = null;
  }
  //#endregion

  autoCompleteDepartment(DepartmentValue:any, index:number) {
    this.onsetdisableRow();
    const items = <FormArray>this.VisitPaymentForm.controls['rows'];
    if (!this.DepartmentitemNameList.includes(DepartmentValue) && this.DepartmentitemNameList.length > 0) {
      items.controls[index].get('Department').setValue('');
      items.controls[index].get('BillingParticulars').setValue('');
      items.controls[index].get('BillingParticulars').disable();
      items.controls[index].get('Charges').setValue('');
    }
    if (this.DepartmentitemNameList.length <= 0) {
      items.controls[index].get('Department').setValue('');
      items.controls[index].get('BillingParticulars').setValue('');
      items.controls[index].get('BillingParticulars').disable();
      items.controls[index].get('Charges').setValue('');
    }
  }

  autoCompleteBilling(BillingParticularsValue:any, index:number) {
    const items = <FormArray>this.VisitPaymentForm.controls['rows'];
    if (!this.BillingitemNameList.includes(BillingParticularsValue) && this.BillingitemNameList.length > 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
    if (this.BillingitemNameList.length <= 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
  }


  //#region "ResetData"
  ResetData() {
    this.VisitPaymentForm.reset();
    this.DepartmentitemNameList = [];
    this.BillingitemNameList = [];
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.VisitPaymentForm.get('ReceiptDate').setValue(new Date());
    this.VisitPaymentForm.get('GrandTotal').setValue(0);
    this.VisitPaymentForm.get('GrandTotalshow').setValue(0);
    this.rows.clear();
    this.onAddRow();
    this.mismatch = true;
  }
  //#endregion


    //#region "backToVisit"
    backToVisit() {
      this.router.navigate(['/home/visits']);
    }
    //#endregion
}
