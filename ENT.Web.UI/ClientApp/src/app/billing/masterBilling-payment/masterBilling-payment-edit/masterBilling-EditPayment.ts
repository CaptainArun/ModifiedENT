import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MasterBillingPaymentModel } from '../../models/masterBillingPayment';
import { MasterBillingPaymentDetailsModel } from '../../models/MasterBillingPaymentDetailsModel';
import { billingService } from '../../billing.service';
import { VisitService } from '../../../visit/visit.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';

@Component({
  selector: 'app-masterBillingEditPayment',
  templateUrl: './masterBilling-EditPayment.html',
  styleUrls: ['./masterBilling-EditPayment.css']
})

export class MasterBillingEditPaymentComponent implements OnInit {

  //#region "Property Declaration"
  masterBillingPaymentForm: FormGroup;
  MasterBillingPaymentModel: MasterBillingPaymentModel = new MasterBillingPaymentModel();
  rows: FormArray = this.fb.array([]);
  DepartmentInfo: any;
  MasterBillingTypInfo;
  BillingpartCharges: any;
  billidentify: any;
  identify: any;
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
  //showSearchField: boolean = false;
  patientById: any;
  patientparticularId: any;
  billingTypename: any;
  VisitDateandTimeType: any;
  patientdetailVisitId: any;
  patientdetailAdmissiontId: any;
  AdmissionDateandTimeType: any;
  BillingParticularsName: any;
  SetupMasterID: any;
  showingVisitEdit: boolean;
  showingAdmissionEdit: boolean;
  ReceiptDate: any;
  VisitDateandTimeDetail: any;
  AdmissionDateandTimeDetail: any;
  GrandTotalfield: any;
  addedRow: boolean = false;
  DepartmentitemNameList = [];
  BillingitemNameList = [];
  //#endregion

  //#region "constructor"
  constructor(private fb: FormBuilder, private billingService: billingService, private VisitPaymentService: VisitService, public customhttp: CustomHttpService, public dialog: MatDialog, private util: UtilService, public dialogRef: MatDialogRef<MasterBillingEditPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data1: any) {
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
      BillingParticularsubNumber: [''],
      GrandTotalshow: [''],
      paymentDetailsItem: MasterBillingPaymentDetailsModel,
      rows: this.rows
    });
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.onAddRow();
    this.getPatientList();
    this.GetPaymentTypeListforBilling();
    if (this.data1 != null && this.data1 != undefined && this.data1 != "") {
      this.getPatientId(this.data1.PatientId);
      this.setValue(this.data1);
      this.show = true;
    }
    else {
      this.GetReceiptNumber();
      this.GetBillNumber();
    }
  }
  //#endregion

  //#region "onAddRow"
  onAddRow() {
    this.rows.push(this.createItemFormGroup());
    this.calculateTotalCharges();
    this.DepartmentInfo = null;
    this.MasterBillingTypInfo = null;
    this.addedRow = true;
    if (this.rows.length > this.data1.paymentDetailsItem.length) {
      this.onsetdisableRow();
    }
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
            });
          }
          else {
            this.filteredOptions = null;
            this.show = false;
          }
        }
      });
  }
  //#endregion

  //#region "GetPaymentTypeListforBilling"
  GetPaymentTypeListforBilling() {
    this.billingService.GetPaymentTypeListforBilling().then(data => {
      this.PaymentM = data;
    });
  }
  //#endregion

  //#region "getPatientId"
  getPatientId(id: number) {
    this.patientparticularId = id;
    this.billingService.getPatientDetailsById(id).then(data => {
      if (data != undefined && data != null) {
        this.patientById = data;
        //this.show = true;
      }
    });
  }
  //#endregion

  //#region "showingHiddenfields"
  showingHiddenfields(value) {

    if (value == "visit") {
      this.billingTypename = value;
      this.getVisitAdmissionDateandtime();
      this.showingVisit = true;
    }
    else {
      this.showingVisit = false;
    }
    if (value == "Admission") {
      this.billingTypename = value;
      this.getVisitAdmissionDateandtime();
      this.showingAdmission = true;
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
      }
      if (data != undefined && data != null && data.admissionCollection != null) {
        this.AdmissionDateandTimeType = data.admissionCollection;
      }
    });
  }
  //#endregion

  //#region "showPatientVisitId"
  showPatientVisitId(id: any) {
    this.patientdetailVisitId = id;
  }
  //#endregion

  //#region "showPatientAdmissiontId"
  showPatientAdmissiontId(id: any) {
    this.patientdetailAdmissiontId = id;
  }
  //#endregion

  //#region "setValue"
  setValue(data: any) {    
    this.masterBillingPaymentForm.get('BillingTypeName').disable();
    this.masterBillingPaymentForm.get('BillingTypeName').setValue(data.billType);
    if (data.VisitDateandTime) {
      this.showingVisitEdit = true;
      this.VisitDateandTimeDetail = data.VisitDateandTime;
      this.masterBillingPaymentForm.get('VisitDateandTime').setValue(data.VisitDateandTime);
      this.masterBillingPaymentForm.get('VisitID').setValue(data.VisitID);
      this.patientdetailVisitId = data.VisitID;
    }
    if (data.AdmissionDateandTime) {
      this.showingAdmissionEdit = true;
      this.AdmissionDateandTimeDetail = data.AdmissionDateandTime;
      this.masterBillingPaymentForm.get('AdmissionDateandTime').setValue(data.AdmissionDateandTime);
      this.masterBillingPaymentForm.get('AdmissionID').setValue(data.AdmissionID);
      this.patientdetailAdmissiontId = data.AdmissionID;
    }
    this.MasterBillingPaymentModel.paymentDetailsItem = [];
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
    for (let i = 0; i < data.paymentDetailsItem.length; i++) {
      control.controls[i].get('Department').setValue(data.paymentDetailsItem[i].DepartmentName);
      control.controls[i].get('DepartmentNumber').setValue(data.paymentDetailsItem[i].DepartmentId);
      control.controls[i].get('Charges').setValue(data.paymentDetailsItem[i].Charges);
      control.controls[i].get('BillingParticularsubNumber').setValue(data.paymentDetailsItem[i].SetupMasterID);
      control.controls[i].get('BillingParticulars').setValue(data.paymentDetailsItem[i].billingParticular);
      this.DepartmentitemNameList.push(data.paymentDetailsItem[i].DepartmentName);
      this.BillingitemNameList.push(data.paymentDetailsItem[i].billingParticular);
      // control.controls[i].get('BillingParticulars').disable();
      if (i < data.paymentDetailsItem.length - 1) {
        this.onAddRow();
      }
    }
    this.identify = data.ReceiptNo;
    this.billidentify = data.BillNo;
    this.masterBillingPaymentForm.get('ReceiptNo').setValue(this.identify);
    this.masterBillingPaymentForm.get('ReceiptDate').setValue(data.ReceiptDate);
    this.masterBillingPaymentForm.get('BillNo').setValue(this.billidentify);
    this.masterBillingPaymentForm.get('MiscAmount').setValue(data.MiscAmount);
    this.masterBillingPaymentForm.get('DiscountPercentage').setValue(parseFloat(data.DiscountPercentage == null ? 0 : data.DiscountPercentage));
    this.masterBillingPaymentForm.get('DiscountAmount').setValue(data.DiscountAmount);
    this.totalCharges = data.GrandTotal;
    this.masterBillingPaymentForm.get('GrandTotal').setValue(this.totalCharges);
    this.masterBillingPaymentForm.get('NetAmount').setValue(data.NetAmount);
    this.masterBillingPaymentForm.get('PaidAmount').setValue(data.PaidAmount);
    this.masterBillingPaymentForm.get('PaymentMode').setValue(data.PaymentMode);
    this.masterBillingPaymentForm.get('Notes').setValue(data.Notes);
    if (this.data1.showView) {
      this.masterBillingPaymentForm.disable();
      this.hideButton = true;
    }
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
          this.onsetdisableRow()
        }
      });
    }
    else {
      this.DepartmentInfo = null;
      this.MasterBillingTypInfo = null;
      this.onsetdisableRow()

    }
  }
  //#endregion

  // //#region "DepartmentId"
  // DepartmentId(DepartmentID, index) {
  //   // const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
  //   // control.controls[i].get('DepartmentNumber').setValue(DepartmentID);
  //   (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
  //   this.onsetdisableRow();
  //   this.DepartmentInfo = null;
  // }
  // //#endregion

  onsetdisableRow() {
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
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
  //#region "GetBillingtype"
  GetBillingtype(index) {
    const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];
    let key = control.controls[index].get('BillingParticulars').value;
    if (key != null && key !== "") {
      if (key.length > 2) {
        for (let i = 0; i < control.length; i++) {
          this.VisitPaymentService.GetbillingParticulars(control.controls[index].get('DepartmentNumber').value, key).then(data => {
            this.MasterBillingTypInfo = data;
            for (let i = 0; i < data.length; i++) {
              this.BillingpartCharges = this.MasterBillingTypInfo[i].Charges;
            }
          });
        }
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
  // //#region "GetReceiptNumber"
  // billingCharges(BillingpartCharges: number, index: number, option) {

  //   (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
  //   (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(option.SetupMasterID);
  //   this.calculateTotalCharges();
  //   this.MasterBillingTypInfo = null;
  // }
  // //#endregion

  //#region "GetReceiptNumber"
  GetReceiptNumber() {

    this.billingService.GetReceiptNumber().then(res => {
      this.identify = res[0];

    });

  }
  //#endregion

  //#region "GetBillNumber"
  GetBillNumber() {

    this.billingService.GetBillNumber().then(res => {
      this.billidentify = res[0];
    })
  }
  //#endregion

  //#region "submit"
  submitData() {
    if (this.masterBillingPaymentForm.valid) {

      this.MasterBillingPaymentModel.paymentDetailsItem = [];

      const control = <FormArray>this.masterBillingPaymentForm.controls['rows'];

      for (let row of control.controls) {
        this.MasterBillingPaymentModel.paymentDetailsItem.push({
          Charges: parseInt(row.get('Charges').value),
          BillingParticularsubNumber: row.get('BillingParticulars').value,
          SetupMasterID: parseInt(row.get('BillingParticularsubNumber').value),
          VisitPaymentID: 0,
          AdmissionPaymentID: 0,
          Department: row.get('Department').value,
        });
      }

      this.MasterBillingPaymentModel.ReceiptNo = this.identify;

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

      this.MasterBillingPaymentModel.BillNo = this.billidentify;

      this.MasterBillingPaymentModel.MiscAmount = Number(this.masterBillingPaymentForm.get('MiscAmount').value ? this.masterBillingPaymentForm.get('MiscAmount').value: 0);

      this.MasterBillingPaymentModel.DiscountPercentage = parseFloat(this.masterBillingPaymentForm.get('DiscountPercentage').value);

      this.MasterBillingPaymentModel.DiscountAmount = this.masterBillingPaymentForm.get('DiscountAmount').value ? this.masterBillingPaymentForm.get('DiscountAmount').value : 0;

      this.MasterBillingPaymentModel.GrandTotal = this.totalCharges;

      this.MasterBillingPaymentModel.NetAmount = this.masterBillingPaymentForm.get('NetAmount').value;

      this.MasterBillingPaymentModel.PaidAmount = Number(this.masterBillingPaymentForm.get('PaidAmount').value);

      this.MasterBillingPaymentModel.PaymentMode = this.masterBillingPaymentForm.get('PaymentMode').value;

      this.MasterBillingPaymentModel.Notes = this.masterBillingPaymentForm.get('Notes').value;

      this.MasterBillingPaymentModel.BillingTypeName = this.masterBillingPaymentForm.get('BillingTypeName').value;


      if (this.masterBillingPaymentForm.get('BillingTypeName').value === "Visit") {
        if (this.MasterBillingPaymentModel.PaidAmount > 0) {

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
        if (this.MasterBillingPaymentModel.PaidAmount > 0) {
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
 DepartmentId(DepartmentDesc:any , DepartmentID:any, index:number) {
  (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('DepartmentNumber').setValue(DepartmentID);
  this.DepartmentitemNameList[index] = DepartmentDesc;
  this.onsetdisableRow();
  this.DepartmentInfo = null;
}
//#endregion


  //#region "GetReceiptNumber"
  billingCharges(billingparticularDesc:any,BillingpartCharges: number, index: number, option) {
    (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('Charges').setValue(BillingpartCharges);
    (<FormArray>this.masterBillingPaymentForm.controls['rows']).controls[index].get('BillingParticularsubNumber').setValue(option.SetupMasterID);
    this.BillingitemNameList[index] = billingparticularDesc;
    this.calculateTotalCharges();
    this.MasterBillingTypInfo = null;
  }
  //#endregion

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








  //#region "back"
  backToVisit() {
    this.dialogRef.close();
  }
  //#endregion

  //#region "ResetData"
  ResetData() {
    this.masterBillingPaymentForm.reset();
    this.DepartmentitemNameList = [];
    this.BillingitemNameList = [];
    this.rows.clear();
    this.onAddRow();
    this.setValue(this.data1);
    this.mismatch = true;
  }
  //#endregion

  //#region "dialogClose"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion

}
