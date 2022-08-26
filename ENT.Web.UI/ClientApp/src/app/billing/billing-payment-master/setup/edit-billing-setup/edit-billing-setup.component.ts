import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { billingService } from "../../../billing.service";
import { BillingSetupModel } from "../../../models/BillingSetupModel";

@Component({
  selector: 'app-edit-Billing-setup',
  templateUrl: './edit-Billing-setup.component.html',
  styleUrls: ['./edit-Billing-setup.component.css']
})


export class EditBillingSetupComponent implements OnInit {

  //#region "Property Declaration"
  BillingSetupEditForm: FormGroup;
  BillingSetupModel: BillingSetupModel = new BillingSetupModel();
  DepartmentInfo: any;
  departID: any;
  MasterBillID: any;
  MasterBillingTypInfo: any;
  SubMasterBillingTypInfo: any;
  StatusData: any;
  PaymentM: any;
  //#endregion

  //#region "constructor"
  constructor(private util: UtilService, private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<EditBillingSetupComponent>, private BillingSetupService: billingService, @Inject(MAT_DIALOG_DATA) public data: any, public customhttp: CustomHttpService) { }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
      this.BillingSetupEditForm = this.fb.group({
      DepartmentID: [''],
      MasterBillingType: [''],
      SubMasterBillingType: [''],
      Status: [''],
      OrderNo: [''],
      AllowDiscount: [''],
      AllowPartialPayment: [''],
      UserTypeBilling: [''],
      UserType: [''],
      Charges: [''],
      AcceptedPaymentMode: [''],
    });


    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.SetSetupBilling();
    this.GetDepartmentCodeList();
    this.getStatus();
    this.GetPaymentTypeListforBilling();

  }
  //#endregion

  //#region "Get-Status Data"

  getStatus() {
    this.BillingSetupService.GetBillingStatus().then(data => {
      this.StatusData = data;
    });
  }

  //#endregion

  //#region "GetPaymentTypeListforBilling"

  GetPaymentTypeListforBilling() {
    this.BillingSetupService.GetPaymentTypeListforBilling().then(data => {
      this.PaymentM = data;
    });
  }

  //#endregion

  //#region "Get-DepartmentValue"
  GetDepartmentCodeList() {
    this.BillingSetupEditForm.get('DepartmentID').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.BillingSetupService.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;
          });
        }
        else{
          this.DepartmentInfo = null;
        }
      }
    });
  }
  //#endregion

  //#region "Get-DepartmentID"
  departmentID(DepartmentID: number) {
    this.departID = DepartmentID;
  }
  //#endregion

  //#region "Get-BillingMasterID"
  masterbillingID(BillingMasterID: number) {
    this.MasterBillID = BillingMasterID;
  }
  //#endregion


  //#region "Get-MasterBillingType Data"
  GetBillingtype() {
    this.BillingSetupEditForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.BillingSetupService.GetMasterBillingTypes(this.departID, key).then(data => {
            this.MasterBillingTypInfo = data;
          });
        }
        else{
          this.MasterBillingTypInfo = null;
        }
      }
    });
  }
  //#endregion


  //#region "Get-SubMasterBillingType Data"
  GetSubmasterBillingtype() {
    this.BillingSetupEditForm.get('SubMasterBillingType').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.BillingSetupService.getSubMasterBillingTypesforMasterBillingType(this.MasterBillID, key).then(data => {
            this.SubMasterBillingTypInfo = data;
          });
        } else{
          this.SubMasterBillingTypInfo = null;
        }
      }
    });
  }
  //#endregion

  //#region "SetData"
  SetSetupBilling() {
    if(this.data.SubMasterBillingType==""){
      this.BillingSetupEditForm.get('SubMasterBillingType').disable();
    }
    this.BillingSetupEditForm.get('DepartmentID').setValue(this.data.DepartmentName);
    this.BillingSetupEditForm.get('MasterBillingType').setValue(this.data.MasterBillingTypeName);
    this.BillingSetupEditForm.get('SubMasterBillingType').setValue(this.data.SubMasterBillingType);
    this.BillingSetupEditForm.get('Status').setValue(this.data.Status);
    this.BillingSetupEditForm.get('AllowDiscount').setValue(this.data.AllowDiscount);
    this.BillingSetupEditForm.get('OrderNo').setValue(this.data.OrderNo);
    this.BillingSetupEditForm.get('AllowPartialPayment').setValue(this.data.AllowPartialPayment);
    this.BillingSetupEditForm.get('UserTypeBilling').setValue(this.data.UserTypeBilling);
    this.BillingSetupEditForm.get('UserType').setValue(this.data.UserType);
    this.BillingSetupEditForm.get('Charges').setValue(this.data.Charges);
    this.BillingSetupEditForm.get('AcceptedPaymentMode').setValue(this.data.AcceptedPaymentMode);
  }
  //#endregion



  //#region "submitData"
  submitData() {
    if( this.BillingSetupEditForm.valid){
      this.BillingSetupModel.DepartmentID = this.data.DepartmentID;
      this.BillingSetupModel.MasterBillingType = this.data.MasterBillingType;
      this.BillingSetupModel.SubMasterBillingType = this.BillingSetupEditForm.get('SubMasterBillingType').value;
      this.BillingSetupModel.AllowDiscount = (this.BillingSetupEditForm.get('AllowDiscount').value);
      this.BillingSetupModel.OrderNo = (this.BillingSetupEditForm.get('OrderNo').value);
      this.BillingSetupModel.Status = (this.BillingSetupEditForm.get('Status').value);
      this.BillingSetupModel.AllowPartialPayment = (this.BillingSetupEditForm.get('AllowPartialPayment').value);
      this.BillingSetupModel.UserTypeBilling = (this.BillingSetupEditForm.get('UserTypeBilling').value);
      this.BillingSetupModel.UserType = (this.BillingSetupEditForm.get('UserType').value);
      this.BillingSetupModel.Charges = this.BillingSetupEditForm.get('Charges').value;
      this.BillingSetupModel.AcceptedPaymentMode = this.BillingSetupEditForm.get('AcceptedPaymentMode').value;
      
      this.BillingSetupService.AddUpdateBillingSetupMasterData(this.BillingSetupModel).then(res => {
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
    this.SetSetupBilling();
  }
  //#endregion

  //#region "dialog-close"
  close() {
    this.dialogRef.close();
  }
  //#endregion

}
