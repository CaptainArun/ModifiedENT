import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmissionPaymentModel } from '../Models/AdmissionPaymentModel';
import { CustomHttpService } from '../../core/custom-http.service';
import { AdmisssionPaymentDetailsModel } from '../Models/AdmissionPaymentDetailsModel';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionService } from '../admission.service';
import { UtilService } from '../../core/util.service';
import { MatDialog } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { NewAdmissionComponent } from '../new-admission/new-admission.component';

@Component({
  selector: 'app-admisssion-payment',
  templateUrl: './admission-payment.component.html',
  styleUrls: ['./admission-payment.component.css']
})
export class admissionPaymentComponent implements OnInit {

  //#region "Property Declaration"
  @ViewChild(NewAdmissionComponent, { static: true }) newAdmissionComponent;

  AdmissionPaymentForm: FormGroup;
  AdmissionPaymentModel: AdmissionPaymentModel = new AdmissionPaymentModel();
  rows: FormArray = this.fb.array([]);
  DepartmentInfo: any;
  MasterBillingTypInfo: any;
  BillingpartCharges: any;
  depCharges: any;
  ReceiptNo: any;
  totalCharges: any = 0;
  PaymentM: any;
  AdmissionPaymentId: any;
  totalInfo: any;
  hideButton: boolean = false;
  mismatch: boolean = true;
  value1: any;
  SetupMasterID: any;
  BillingParticularsName: any;
  GrandTotalfield: boolean;
  billingParticulartolltip: any;
  PatientCardId:any;
  DepartmentitemNameList = [];
  BillingitemNameList = [];
  //#endregion

  //#region "constructor"

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private AdmissionPaymentService: AdmissionService, public customhttp: CustomHttpService, public dialog: MatDialog, private util: UtilService) {
  }
  //#endregion


  getDynamicControl() {
    return <FormArray>this.AdmissionPaymentForm.get('rows');
  }

  //#region "ngOnInit"
  ngOnInit() {
    this.AdmissionPaymentForm = this.fb.group({
      AdmissionID: [''],
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

      paymentDetailsItem: AdmisssionPaymentDetailsModel,
      rows: this.rows
    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.onAddRow();
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.GetPaymentTypeListforAdmission();
    this.onsetdisableRow();

    this.activatedRoute.params.subscribe(params => {
      this.AdmissionPaymentId = params.id;
      this.PatientCardId = params.PatientID;
      if (this.AdmissionPaymentId != null && this.AdmissionPaymentId != undefined) {
        this.getAdmissionPaymentDetail();
      }
    });
  }
  //#endregion

  //#region "GetPaymentTypeListforAdmission"
  GetPaymentTypeListforAdmission() {
    this.AdmissionPaymentService.GetPaymentTypeListforAdmission().then(data => {
      this.PaymentM = data;
    });
  }
  //#endregion
  onsetdisableRow(){
    const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
    for (let row of control.controls) {
      if (row.get('Department') != null && row.get('Department').value != undefined && row.get('Department').value != null && row.get('Department').value.length > 2) {
        row.get('BillingParticulars').enable();
      }
      else{
        row.get('BillingParticulars').disable();
        row.get('BillingParticulars').setValue("");
        row.get('Charges').setValue("");
      }
    }
  }



  //#region "getAdmissionPaymentDetail"
  getAdmissionPaymentDetail() {

    this.AdmissionPaymentService.admissionPaymentDetail(this.AdmissionPaymentId).then(res => {

      if (res != null && res != undefined) {
        this.totalInfo = res;

      }
      else {
        this.totalInfo = this.AdmissionPaymentService.admissionPaymentViewItem;
      }

      if (this.totalInfo != null && this.totalInfo != undefined) {
        this.setValueDetails(this.totalInfo);
      }

    });
  }
  //#endregion

  //#region "setValueDetails"
  setValueDetails(value1) {
    this.GrandTotalfield = true;
    this.AdmissionPaymentModel.paymentDetailsItem = [];
    const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
    for (let i = 0; i < value1.paymentDetailsItem.length; i++) {
      control.controls[i].get('Department').setValue(value1.paymentDetailsItem[i].DepartmentName);
      control.controls[i].get('Charges').setValue(value1.paymentDetailsItem[i].Charges.toFixed(2));
      control.controls[i].get('BillingParticularsubNumber').setValue(value1.paymentDetailsItem[i].Charges.toFixed(2));
      control.controls[i].get('BillingParticulars').setValue(value1.paymentDetailsItem[i].billingParticular);
      this.billingParticulartolltip = value1.paymentDetailsItem[i].billingParticular;
      if (i < value1.paymentDetailsItem.length - 1) {
        this.onAddRow();
      }
    }
    this.AdmissionPaymentForm.get('ReceiptNo').setValue(value1.ReceiptNo);
    this.AdmissionPaymentForm.get('AdmissionID').setValue(value1.AdmissionID);
    this.AdmissionPaymentForm.get('ReceiptDate').setValue(value1.ReceiptDate);
    this.AdmissionPaymentForm.get('BillNo').setValue(value1.BillNo);
    this.AdmissionPaymentForm.get('MiscAmount').setValue(value1.MiscAmount.toFixed(2));
    this.AdmissionPaymentForm.get('DiscountPercentage').setValue(parseFloat(value1.DiscountPercentage == null ? 0 : value1.DiscountPercentage));
    this.AdmissionPaymentForm.get('DiscountAmount').setValue(value1.DiscountAmount);
    this.AdmissionPaymentForm.get('GrandTotalshow').setValue(value1.GrandTotal.toFixed(2));
    this.AdmissionPaymentForm.get('NetAmount').setValue(value1.NetAmount.toFixed(2));
    this.AdmissionPaymentForm.get('PaidAmount').setValue(value1.PaidAmount.toFixed(2));
    this.AdmissionPaymentForm.get('PaymentMode').setValue(value1.PaymentMode);
    this.AdmissionPaymentForm.get('Notes').setValue(value1.Notes);
    this.AdmissionPaymentForm.disable();
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
    this.totalCharges = Number(this.AdmissionPaymentForm.controls['MiscAmount'].value);
    const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
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
    let discountPercentage: number = this.AdmissionPaymentForm.controls['DiscountPercentage'].value;
    let discountValue: number = (Number(discountPercentage) / 100) * totalValue; //percentage
    let netTotal: number = this.totalCharges - discountValue;
    this.AdmissionPaymentForm.controls['DiscountAmount'].setValue(discountValue);
    this.AdmissionPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.AdmissionPaymentForm.controls['PaidAmount'].setValue('');
  }
  //#endregion

  //#region "calculateDiscountamount"
  calculateDiscountamount() {
    let totalValue: number = this.totalCharges;
    let DiscountAmount: number = this.AdmissionPaymentForm.controls['DiscountAmount'].value;
    let netTotal: number = totalValue - DiscountAmount;
    this.AdmissionPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.AdmissionPaymentForm.controls['PaidAmount'].setValue('');
  }
  //#endregion

  //#region "amountAfterPaid"
  amountAfterPaid() {
    if (this.AdmissionPaymentForm.controls['PaidAmount'].value! <= this.AdmissionPaymentForm.controls['NetAmount'].value) {
      this.mismatch = true;
    }
    else {
      this.mismatch = false;
    }
  }
  //#endregion

  //#region "GetDepartmentCodeList"
  GetDepartmentCodeList(index) {

    const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
    let key = control.controls[index].get('Department').value;
    if (key != null) {
      if (key.length > 2) {
        this.AdmissionPaymentService.GetDepartmentsfromMaster(key).then(data => {
          this.DepartmentInfo = data;
        })
      }
      else {
        this.DepartmentInfo = null;
        this.MasterBillingTypInfo = null;
        this.onsetdisableRow();
      }
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
    const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
    let key = control.controls[index].get('BillingParticulars').value;
    if (key != null) {
      if (key.length > 2) {
        this.AdmissionPaymentService.GetbillingParticulars(control.controls[index].get('DepartmentNumber').value, key).then(data => {
          this.MasterBillingTypInfo = data;
          for (let i = 0; i < data.length; i++) {
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
  //   (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
  //   this.onsetdisableRow();
  //   this.DepartmentInfo = null;
  // }
  // //#endregion

  // //#region "billingCharges"
  // billingCharges(BillingpartCharges, index, option) {
  //   this.SetupMasterID = option.SetupMasterID;
  //   this.BillingParticularsName = option.BillingParticulars;
  //   this.billingParticulartolltip = option.billingparticularName;
  //   (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
  //   (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(this.SetupMasterID);
  //   this.calculateTotalCharges();
  //   this.MasterBillingTypInfo = null;
  // }
  // //#endregion

  //#region "GetReceiptNumber"
  GetReceiptNumber() {
    this.AdmissionPaymentService.GetReceiptNumber().then(res => {
      this.AdmissionPaymentForm.get('ReceiptNo').setValue(res[0]);
    })
  }
  //#endregion


  //#region "GetBillNumber"
  GetBillNumber() {
    this.AdmissionPaymentService.GetBillNumber().then(res => {
      this.AdmissionPaymentForm.get('BillNo').setValue(res[0]);
    })
  }
  //#endregion


  //#region "submitData"
  submitData() {
    if (this.AdmissionPaymentForm.valid) {



      this.AdmissionPaymentModel.paymentDetailsItem = [];

      const control = <FormArray>this.AdmissionPaymentForm.controls['rows'];
      if (this.AdmissionPaymentForm.controls['rows'].valid) {


        for (let row of control.controls) {
          this.AdmissionPaymentModel.paymentDetailsItem.push({
            Charges: row.get('Charges').value,
            SetupMasterID: row.get('BillingParticularsubNumber').value,
            AdmissionPaymentID: 0,
            Department: row.get('Department').value,
            BillingParticularsubNumber: row.get('BillingParticulars').value
          });
        }

        this.AdmissionPaymentModel.ReceiptNo = this.AdmissionPaymentForm.get('ReceiptNo').value;

        this.AdmissionPaymentModel.AdmissionID = this.AdmissionPaymentId;

        this.AdmissionPaymentModel.ReceiptDate = this.AdmissionPaymentForm.get('ReceiptDate').value;

        this.AdmissionPaymentModel.BillNo = this.AdmissionPaymentForm.get('BillNo').value;

        this.AdmissionPaymentModel.MiscAmount = Number(this.AdmissionPaymentForm.get('MiscAmount').value ? this.AdmissionPaymentForm.get('MiscAmount').value :0);

        this.AdmissionPaymentModel.DiscountPercentage = parseFloat(this.AdmissionPaymentForm.get('DiscountPercentage').value);

        this.AdmissionPaymentModel.DiscountAmount = this.AdmissionPaymentForm.get('DiscountAmount').value?this.AdmissionPaymentForm.get('DiscountAmount').value:0;

        this.AdmissionPaymentModel.GrandTotal = this.totalCharges;

        this.AdmissionPaymentModel.NetAmount = Number(this.AdmissionPaymentForm.get('NetAmount').value);

        this.AdmissionPaymentModel.PaidAmount = Number(this.AdmissionPaymentForm.get('PaidAmount').value);

        this.AdmissionPaymentModel.PaymentMode = this.AdmissionPaymentForm.get('PaymentMode').value;

        this.AdmissionPaymentModel.Notes = this.AdmissionPaymentForm.get('Notes').value;

        this.AdmissionPaymentService.AddUpdateAdmissionPayment(this.AdmissionPaymentModel).then(data => {

          this.util.showMessage('', 'Admission payment saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              if (res === true) {
                this.router.navigate(['/home/admission']);
              }
            }
          );

        });
      }
    }
  }
  //#endregion
  //#region "DepartmentId"
  DepartmentId(DepartmentDesc,DepartmentID,index) {
    (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
    this.DepartmentitemNameList[index] = DepartmentDesc;
    this.onsetdisableRow();
    this.DepartmentInfo = null;
  }
  //#endregion

  //#region "billingCharges"
  billingCharges(billingparticularDesc,BillingpartCharges, index, option) {
    this.SetupMasterID = option.SetupMasterID;
    this.BillingParticularsName = option.BillingParticulars;
    this.billingParticulartolltip = option.billingparticularName;
    (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
    (<FormArray>this.AdmissionPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(this.SetupMasterID);
    this.BillingitemNameList[index] = billingparticularDesc;
    this.calculateTotalCharges();
    this.MasterBillingTypInfo = null;
  }
  //#endregion

  autoCompleteDepartment(DepartmentValue, index) {
    this.onsetdisableRow();
    const items = <FormArray>this.AdmissionPaymentForm.controls['rows'];
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

  autoCompleteBilling(BillingParticularsValue, index) {
    const items = <FormArray>this.AdmissionPaymentForm.controls['rows'];
    if (!this.BillingitemNameList.includes(BillingParticularsValue) && this.BillingitemNameList.length > 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
    if (this.BillingitemNameList.length <= 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
  }



  backToVisit() {
    this.router.navigate(['/home/admission']);
    //this.newAdmissionComponent.date();
  }

  //#region "ResetData"
  ResetData() {
    this.AdmissionPaymentForm.reset();
    this.DepartmentitemNameList = [];
    this.BillingitemNameList = [];
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.AdmissionPaymentForm.get('ReceiptDate').setValue(new Date());
    this.AdmissionPaymentForm.get('GrandTotal').setValue(0);
    this.AdmissionPaymentForm.get('GrandTotalshow').setValue(0);
    this.rows.clear();
    this.onAddRow();
    this.mismatch = true;
  }
  //#endregion

}