import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CustomHttpService } from '../../core/custom-http.service';
import { UtilService } from '../../core/util.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../ux/bmsmsgbox/bmsmsgbox.component';
import { VisitService } from '../../visit/visit.service';
import { MasterBillingPaymentModel } from '../models/masterBillingPayment';
import { MasterBillingPaymentDetailsModel } from '../models/MasterBillingPaymentDetailsModel';
import { billingService } from '../billing.service';
@Component({
  selector: 'app-masterBillingPayment',
  templateUrl: './masterBilling-Payment.html',
  styleUrls: ['./masterBilling-Payment.css']
})

export class MasterBillingPaymentComponent implements OnInit {

  //#region "Property Declaration"
  masterBillingPaymentForm: FormGroup;
  MasterBillingPaymentModel: MasterBillingPaymentModel = new MasterBillingPaymentModel();
  rows: FormArray = this.fb.array([]);
  DepartmentInfo: any;
  MasterBillingTypInfo: any;
  BillingpartCharges: any;
  totalCharges: any = 0;
  PaymentM: any;
  VisitPaymentId: any;
  AdmissionPaymentID: any;
  totalInfo: any;
  hideButton: boolean = false;
  mismatch: boolean = true;
  showingVisit: boolean;
  showingAdmission: boolean;
  filteredOptions: any;
  show: boolean = false;
  showSearchField: boolean = true;
  patientById: any;
  patientparticularId: any;
  billingTypename: any;
  VisitDateandTimeType: any;
  patientdetailVisitId: any;
  patientdetailAdmissiontId: any;
  AdmissionDateandTimeType: any;
  GrandTotalfield: boolean;
  BillingParticularsName: any;
  SetupMasterID: any;
  showingVisitEdit: boolean;
  showingAdmissionEdit: boolean;
  ReceiptDate: any;
  BillingTypeNameData: string[] = [];
  DepartmentitemNameList = [];
  BillingitemNameList = [];
  //#endregion

  @ViewChild('BillType', { static: true }) BillType;
  disableSave: boolean;
  //#region "constructor"
  constructor(private fb: FormBuilder, private billingService: billingService, private VisitPaymentService: VisitService, public customhttp: CustomHttpService, public dialog: MatDialog, private util: UtilService, public dialogRef: MatDialogRef<MasterBillingPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data1: any) {
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.masterBillingPaymentForm = this.fb.group({
      searchPatientList: [''],
      VisitID: [''],
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
      BillingTypeName: [''],
      VisitDateandTime: [''],
      AdmissionDateandTime: [''],
      BillingParticularsubNumber: [""],
      GrandTotalshow: [''],
      paymentDetailsItem: MasterBillingPaymentDetailsModel,
      rows: this.rows
    });

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.onAddRow();
    this.getPatientList();
    this.GetPaymentTypeListforBilling();
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.onsetdisableRow();
  }
  //#endregion

  //#region "GetPaymentTypeListforBilling"
  GetPaymentTypeListforBilling() {
    this.billingService.GetPaymentTypeListforBilling().then(data => {
      this.PaymentM = data;
    });
  }
  //#endregion

  //#region "getPatientList"
  getPatientList() {
    this.masterBillingPaymentForm.get('searchPatientList').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.billingService.getAllPatientData(key).then(data => {
              this.filteredOptions = data;
              // this.BillingTypeValue();     
              // BillingTypeValue(){
              this.BillingTypeNameData = ["Visit", "Admission"];
              //} 
            });
          }
          else {
            this.filteredOptions = null;
            this.show = false;
            this.masterBillingPaymentForm.get('BillingTypeName').setValue(null)
            this.rows.clear();
            this.onAddRow();
            this.mismatch = true;
            this.show = false;
            this.showingVisit = false;
            this.showingAdmission = false;
            this.VisitDateandTimeType = null;
            this.patientdetailVisitId = null;
            this.patientdetailAdmissiontId = null;
          }
        }
        else {
          this.masterBillingPaymentForm.get('BillingTypeName').setValue(null)
        }

      });

  }
  //#endregion

  //#region "getPatientId"
  getPatientId(id: number) {
    this.patientparticularId = id;
    this.billingService.getPatientDetailsById(id).then(data => {
      if (data != undefined && data != null) {
        this.patientById = data;
        this.show = true;
      }
    });
  }
  //#endregion

  //#region "showingHiddenfields"
  showingHiddenfields(value) {
    if (value == "Visit") {
      this.billingTypename = value;
      this.masterBillingPaymentForm.get('AdmissionDateandTime').clearValidators();
      this.masterBillingPaymentForm.get('VisitDateandTime').setValue("");
      this.masterBillingPaymentForm.get('AdmissionDateandTime').setValue("");
      this.masterBillingPaymentForm.get('AdmissionDateandTime').untouched;
      this.masterBillingPaymentForm.get('VisitDateandTime').updateValueAndValidity();
      this.masterBillingPaymentForm.get('VisitDateandTime').setValidators([Validators.required]);
      this.getVisitAdmissionDateandtime();
     // this.showingVisit = true;
    }
    else {
      this.showingVisit = false;
    }
    if (value == "Admission") {
      this.billingTypename = value;
      this.masterBillingPaymentForm.get('VisitDateandTime').clearValidators();
      this.masterBillingPaymentForm.get('VisitDateandTime').setValue("");
      this.masterBillingPaymentForm.get('AdmissionDateandTime').setValue("");
      this.masterBillingPaymentForm.get('VisitDateandTime').untouched;
      this.masterBillingPaymentForm.get('AdmissionDateandTime').updateValueAndValidity();
      this.masterBillingPaymentForm.get('AdmissionDateandTime').setValidators([Validators.required]);
      this.getVisitAdmissionDateandtime();
     // this.showingAdmission = true;
    }
    else {
      this.showingAdmission = false;
    }
  }
  //#endregion
  //#region "getVisitAdmissionDateandtime"
  getVisitAdmissionDateandtime() {
    this.billingService.getVisitAdmissionDateandtime(this.billingTypename, this.patientparticularId).then(data => {
      this.billingTypename = null;
      if (data != undefined && data != null && data.visitCollection != null) {
        this.VisitDateandTimeType = data.visitCollection;
        (this.VisitDateandTimeType).length > 0 ? ((this.showingVisit = true)&& (this.disableSave = false)) : ((this.showingVisit = true) && (this.disableSave = true));
      }
      if (data != undefined && data != null && data.admissionCollection != null) {
        this.AdmissionDateandTimeType = data.admissionCollection;
        (this.AdmissionDateandTimeType).length > 0 ? ( (this.showingAdmission = true ) && (this.disableSave = false) )  : ( (this.showingAdmission = true ) && (this.disableSave = true) );
      }
    });
  }
  //#endregion

  //#region "showPatientVisitId"
  showPatientVisitId(id: any) {
    this.patientdetailVisitId = id;
    this.patientdetailAdmissiontId = null;

    if (this.patientdetailVisitId != null && this.patientdetailVisitId != undefined) {
      //  this.getVisitPaymentDetail();
    }
  }
  //#endregion

  //#region "showPatientAdmissiontId"
  showPatientAdmissiontId(id: any) {
    this.patientdetailAdmissiontId = id;
    this.patientdetailVisitId = null;

    if (this.patientdetailAdmissiontId != null && this.patientdetailAdmissiontId != undefined) {
      // this.getAdmissionPaymentDetail();
    }
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
      BillingParticularsubNumber: [null, Validators.required],
    });
  }
  //#endregion

  //#region "calculateTotalCharges"
  calculateTotalCharges() {

    this.totalCharges = Number(this.masterBillingPaymentForm.controls['MiscAmount'].value);
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
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
    let discountPercentage: number = this.masterBillingPaymentForm.controls['DiscountPercentage'].value;
    let discountValue: number = (Number(discountPercentage) / 100) * totalValue;
    let netTotal: number = this.totalCharges - discountValue;
    this.masterBillingPaymentForm.controls['DiscountAmount'].setValue(discountValue);
    this.masterBillingPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.masterBillingPaymentForm.controls['PaidAmount'].setValue(null);
  }
  //#endregion

  //#region "calculateDiscountamount"
  calculateDiscountamount() {

    let totalValue: number = this.totalCharges;
    let DiscountAmount: number = this.masterBillingPaymentForm.controls['DiscountAmount'].value;
    let netTotal: number = totalValue - DiscountAmount;
    this.masterBillingPaymentForm.controls['NetAmount'].setValue(netTotal);
    this.masterBillingPaymentForm.controls['PaidAmount'].setValue(null);

  }
  //#endregion

  //#region "amountAfterPaid"
  amountAfterPaid() {

    if (this.masterBillingPaymentForm.controls['PaidAmount'].value <= this.masterBillingPaymentForm.controls['NetAmount'].value) {
      this.mismatch = true;
    }
    else {
      this.mismatch = false;
    }
  }
  //#endregion

  //#region "GetDepartmentCodeList"
  GetDepartmentCodeList(index) {

    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
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
    } else {
      this.DepartmentInfo = null;
      this.MasterBillingTypInfo = null;
      this.onsetdisableRow();

    }
  }
  //#endregion

  // //#region "DepartmentId"
  // DepartmentId(DepartmentID,index) {
  //   (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
  //   this.onsetdisableRow();
  //   this.DepartmentInfo = null;
  // }
  // //#endregion

  //#region "GetBillingtype"
  GetBillingtype(index) {
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
    let key = control.controls[index].get('BillingParticulars').value;
    if (key != null) {
      if (key.length > 2) {
        this.VisitPaymentService.GetbillingParticulars(control.controls[index].get('DepartmentNumber').value, key).then(data => {
          this.MasterBillingTypInfo = data;
          for (let i = 0; i < data.length; i++) {
            this.BillingpartCharges = this.MasterBillingTypInfo[i].Charges;
          }
        });
      }
      else {
        this.MasterBillingTypInfo = null;
      }
    } else {
      this.MasterBillingTypInfo = null;
    }
  }
  //#endregion


  //#region "GetReceiptNumber"
  GetReceiptNumber() {
    this.billingService.GetReceiptNumber().then(res => {
      this.masterBillingPaymentForm.get('ReceiptNo').setValue(res[0]);

    });
  }
  //#endregion

  //#region "GetBillNumber"
  GetBillNumber() {
    this.billingService.GetBillNumber().then(res => {
      this.masterBillingPaymentForm.get('BillNo').setValue(res[0]);
    })
  }
  //#endregion

  //#region "submitData"
  submitData() {
    if (this.masterBillingPaymentForm.valid) {
      this.MasterBillingPaymentModel.paymentDetailsItem = [];

      const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];

      for (let row of control.controls) {
        this.MasterBillingPaymentModel.paymentDetailsItem.push({
          Charges: row.get('Charges').value,
          BillingParticularsubNumber: row.get('BillingParticulars').value,
          SetupMasterID: row.get('BillingParticularsubNumber').value,
          VisitPaymentID: 0,
          AdmissionPaymentID: 0,
          Department: row.get('Department').value,
        });
      }

      this.MasterBillingPaymentModel.ReceiptNo = this.masterBillingPaymentForm.get('ReceiptNo').value;
      
      if (this.patientdetailVisitId != null && this.patientdetailVisitId != undefined) {
        this.MasterBillingPaymentModel.VisitID = this.patientdetailVisitId;
        this.MasterBillingPaymentModel.AdmissionID = 0;
      }
      else {
        this.MasterBillingPaymentModel.AdmissionID = this.patientdetailAdmissiontId;
        this.MasterBillingPaymentModel.VisitID = 0;
      }
      
      this.ReceiptDate = this.masterBillingPaymentForm.get('ReceiptDate').value;

      this.MasterBillingPaymentModel.ReceiptDate = this.ReceiptDate;

      this.MasterBillingPaymentModel.BillNo = this.masterBillingPaymentForm.get('BillNo').value;

      this.MasterBillingPaymentModel.MiscAmount = Number(this.masterBillingPaymentForm.get('MiscAmount').value ? this.masterBillingPaymentForm.get('MiscAmount').value : 0);

      this.MasterBillingPaymentModel.DiscountPercentage = parseFloat(this.masterBillingPaymentForm.get('DiscountPercentage').value);

      this.MasterBillingPaymentModel.DiscountAmount = this.masterBillingPaymentForm.get('DiscountAmount').value?this.masterBillingPaymentForm.get('DiscountAmount').value:0;

      this.MasterBillingPaymentModel.GrandTotal = this.totalCharges;

      this.MasterBillingPaymentModel.NetAmount = this.masterBillingPaymentForm.get('NetAmount').value;

      this.MasterBillingPaymentModel.PaidAmount = Number(this.masterBillingPaymentForm.get('PaidAmount').value);

      this.MasterBillingPaymentModel.PaymentMode = this.masterBillingPaymentForm.get('PaymentMode').value;

      this.MasterBillingPaymentModel.Notes = this.masterBillingPaymentForm.get('Notes').value;

      this.MasterBillingPaymentModel.BillingTypeName = this.masterBillingPaymentForm.get('BillingTypeName').value;

      if (this.masterBillingPaymentForm.get('BillingTypeName').value === "Visit") {
        this.masterBillingPaymentForm.get('AdmissionDateandTime').clearValidators();
        if (this.masterBillingPaymentForm.get('PaidAmount').value > 0) {
          this.billingService.AddUpdateVisitPaymentfromBilling(this.MasterBillingPaymentModel).then(data => {
            this.util.showMessage('', 'MasterBilling payment saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => {
                if (res === true) {
                  this.dialogRef.close("updated");
                }
              }
            );
          });
        }
      }
      else {
        if (this.masterBillingPaymentForm.get('PaidAmount').value > 0) {
          this.masterBillingPaymentForm.get('VisitDateandTime').clearValidators();
          this.billingService.AddUpdateAdmissionPaymentfromBilling(this.MasterBillingPaymentModel).then(data => {
            this.util.showMessage('', 'MasterBilling payment saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
              (res) => {
                if (res === true) {
                  this.dialogRef.close("updated");
                }
              }
            );
          });
        }
      }
    }
  }
  //#endregion

  //#region "DepartmentId"
  DepartmentId(DepartmentDesc:any,DepartmentID:any,index:number) {
    (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
    this.DepartmentitemNameList[index] = DepartmentDesc;
    this.onsetdisableRow();
    this.DepartmentInfo = null;
  }
  //#endregion

  //#region "billingCharges"
  billingCharges(billingparticularDesc:any, BillingpartCharges: number, index: number, option:any) {
    (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
    (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(option.SetupMasterID);
    this.BillingitemNameList[index] = billingparticularDesc;
    this.calculateTotalCharges();
    this.MasterBillingTypInfo = null;
  }
  //#endregion

  
  onsetdisableRow(){
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
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

  autoCompleteDepartment(DepartmentValue:any, index:number) {
    this.onsetdisableRow();
    const items = <FormArray>this.masterBillingPaymentForm.controls['rows'];
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
    const items = <FormArray>this.masterBillingPaymentForm.controls['rows'];
    if (!this.BillingitemNameList.includes(BillingParticularsValue) && this.BillingitemNameList.length > 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
    if (this.BillingitemNameList.length <= 0) {
      items.controls[index].get('BillingParticulars').setValue('');
    }
  }



  //#region "ResetData"

  ResetData() {
    this.masterBillingPaymentForm.reset();
    this.DepartmentitemNameList = [];
    this.BillingitemNameList = [];
    this.GetReceiptNumber();
    this.GetBillNumber();
    this.masterBillingPaymentForm.get('ReceiptDate').setValue(new Date());
    this.masterBillingPaymentForm.get('GrandTotal').setValue(0);
    this.rows.clear();
    this.onAddRow();
    this.mismatch = true;
    this.show = false;
    this.showingVisit = false;
    this.showingAdmission = false;
    this.VisitDateandTimeType = null;
    this.patientdetailVisitId = null;
    this.patientdetailAdmissiontId = null;
  }

  //#endregion

  //#region "dialogClose"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion

  //#region "backToVisit"
  backToVisit() {
    this.dialogRef.close();
  }
  //#endregion


}