import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteTrigger, MatDialogRef } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { billingService } from "../../../billing.service";
import { BillingSetupModel } from "../../../models/BillingSetupModel";

@Component({
  selector: 'app-add-billing-setup',
  templateUrl: './add-billing-setup.component.html',
  styleUrls: ['./add-billing-setup.component.css']
})

export class AddbillingSetupComponent implements OnInit,AfterViewInit {

  //#region "Property Declaration"
  BillingSetupForm: FormGroup;
  DepartmentInfo: any;
  BillingSetupModel: BillingSetupModel = new BillingSetupModel();
  MasterBillingTypInfo: any;
  SubMasterBillingTypInfo: any;
  BillMasterID: any;
  departID: any;
  MasterBillID: any;
  StatusData: any;
  PaymentM: any;
  AllowSubMasterField: boolean=false;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger })DepartmentAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteBillingType', { static: false, read: MatAutocompleteTrigger })BillingTypeAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteBillingType', { static: false, read: MatAutocompleteTrigger })BillSubMasterType: MatAutocompleteTrigger;
  //#endregion


  //#region "constructor"
  constructor(private util: UtilService, public dialogRef: MatDialogRef<AddbillingSetupComponent>, private fb: FormBuilder, public CustHttp: CustomHttpService, public billingSvc: billingService) {
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.BillingSetupForm = this.fb.group({
      DepartmentID: ['',Validators.required],
      MasterBillingType: ['',Validators.required],
      SubMasterBillingType: [''],
      Status: ['',Validators.required],
      OrderNo: ['',Validators.required],
      AllowDiscount: [''],
      AllowPartialPayment: [''],
      UserTypeBilling: [''],
      UserType: [''],
      Charges: ['',Validators.required],
      AcceptedPaymentMode: [''],
    });
    this.MasterCodeBillingtype();
    this.GetSubmasterBillingtype();
    this.GetDepartmentCodeList();
    this.getStatus();
    this.GetPaymentTypeListforBilling();
   this.BillingSetupForm.get('MasterBillingType').disable();
   this.BillingSetupForm.get('SubMasterBillingType').disable();

  }
   //#endregion



   
   ngAfterViewInit() {

    this.DepartmentAutotrigger.panelClosingActions
    .subscribe(e => {
      if (!(e && e.source)) {
        this.BillingSetupForm.get('DepartmentID').setValue('');
      }
    });

    this.BillingTypeAutotrigger.panelClosingActions
    .subscribe(e => {
      if (!(e && e.source)) {
        this.BillingSetupForm.get('MasterBillingType').setValue('');
      }
    });

    this.BillSubMasterType.panelClosingActions
    .subscribe(e => {
      if (!(e && e.source)) {
        this.BillingSetupForm.get('SubMasterBillingType').setValue('');
      }
    });


  }

  //#region "Get-Status Data"
  getStatus() {
    this.billingSvc.GetBillingStatus().then(data => {
      this.StatusData = data;

    });
  }
  //#endregion

  //#region "GetPaymentTypeListforBilling"

  GetPaymentTypeListforBilling() {
    this.billingSvc.GetPaymentTypeListforBilling().then(data => {
      this.PaymentM = data;
    });
  }

  //#endregion

  //#region "Get-DepartmentValue"
  GetDepartmentCodeList() {
    this.BillingSetupForm.get('DepartmentID').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.billingSvc.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;
          })
        }else {
          this.DepartmentInfo = null;
          this.disableMasterBillingType();
          this.disableSubMasterBillingType();
          this.AllowSubMasterField=false;
        }
      }
      else {
        this.DepartmentInfo = null;
        this.disableMasterBillingType();
        this.disableSubMasterBillingType();
        this.AllowSubMasterField=false;
      } 
    });
  }
  //#endregion

  //#region "Get-DepartmentID"
  departmentID(DepartmentID: number) {
    this.departID = DepartmentID;
    this.BillingSetupForm.get('MasterBillingType').enable();
    this.DepartmentInfo = null;
  }
  //#endregion

  //#region "Get-BillingMasterID"
  masterbillingID(BillingMasterID: number,AllowSubMaster:boolean) {
    this.MasterBillID = BillingMasterID;
    if(AllowSubMaster){
      this.AllowSubMasterField=true;
      this.BillingSetupForm.get('SubMasterBillingType').enable();
      this.BillingSetupForm.get('SubMasterBillingType').markAsUntouched();
      this.BillingSetupForm.get('SubMasterBillingType').setValidators(Validators.required);
      this.BillingSetupForm.get('SubMasterBillingType').updateValueAndValidity();
    }
    this.MasterBillingTypInfo = null;
  }
  //#endregion



  //#region "Get-MasterBillingType Data"
  MasterCodeBillingtype() {
    this.BillingSetupForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.billingSvc.getSubMasterBillingTypesforMasterBillingType(this.departID, key).then(data => {
            this.MasterBillingTypInfo = data;            
          });
        }else {
          this.MasterBillingTypInfo = null;
          this.disableSubMasterBillingType();
          this.AllowSubMasterField=false;
        }
      } 
      else {
        this.MasterBillingTypInfo = null;
        this.disableSubMasterBillingType();
        this.AllowSubMasterField=false;

      }
    });
  }
  //#endregion
  disableSubMasterBillingType(){
    this.BillingSetupForm.get('SubMasterBillingType').disable();
    this.BillingSetupForm.get('SubMasterBillingType').setValue("");
  }

  disableMasterBillingType(){
    this.BillingSetupForm.get('MasterBillingType').disable();
    this.BillingSetupForm.get('MasterBillingType').setValue("");
  }


  //#region "Get-SubMasterBillingType Data"
  GetSubmasterBillingtype() {
    this.BillingSetupForm.get('SubMasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {
          this.billingSvc.SubMasterBillingTypesforMasterBillingType(this.MasterBillID, key).then(data => {
            this.SubMasterBillingTypInfo = data;
          })
        } else {
          this.SubMasterBillingTypInfo = null;
        }
      }
    })
  }
  //#endregion



  //#region "submitData"
  submitData() {
    if(this.BillingSetupForm.valid){
      this.BillingSetupModel.DepartmentID = this.departID;
      this.BillingSetupModel.MasterBillingType = this.MasterBillID;
      this.BillingSetupModel.SubMasterBillingType = this.BillingSetupForm.get('SubMasterBillingType').value;
      this.BillingSetupModel.AllowDiscount = (this.BillingSetupForm.get('AllowDiscount').value);
      this.BillingSetupModel.OrderNo = (this.BillingSetupForm.get('OrderNo').value);
      this.BillingSetupModel.Status = (this.BillingSetupForm.get('Status').value);
      this.BillingSetupModel.AllowPartialPayment = false;
      this.BillingSetupModel.UserTypeBilling = false;
      this.BillingSetupModel.UserType = (this.BillingSetupForm.get('UserType').value);
      this.BillingSetupModel.Charges = this.BillingSetupForm.get('Charges').value;
      this.BillingSetupModel.AcceptedPaymentMode = this.BillingSetupForm.get('AcceptedPaymentMode').value;
      this.billingSvc.AddUpdateBillingSetupMasterData(this.BillingSetupModel).then(res => {
        this.util.showMessage('', 'Billing SetUp details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if (res === true) {
              this.dialogRef.close("Update");
            }
          });
      });
    }
  }
  //#endregion

  //#region "reset"
  Clear() {
    this.BillingSetupForm.get('SubMasterBillingType').clearValidators();
    this.BillingSetupForm.reset();
    this.BillingSetupForm.get('SubMasterBillingType').updateValueAndValidity();
    this.BillingSetupForm.get('MasterBillingType').disable();
    this.BillingSetupForm.get('SubMasterBillingType').disable();
  }
  //#endregion

  //#region "dialog-close"
  close() {
    this.dialogRef.close();
  }
  //#endregion

}
