import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { billingService } from '../../../billing.service';
import { BillingMasterModel } from '../../../models/BillingMasterModel';

@Component({
  selector: 'app-edit-Billing-master',
  templateUrl: './edit-Billing-master.component.html',
  styleUrls: ['./edit-Billing-master.component.css']
})
export class EditBillingMasterComponent implements OnInit {

  //#region "Property Declaration"
  MasterBillingEditForm: FormGroup;
  DepartmentInfo: any;
  BillMasterModel: BillingMasterModel = new BillingMasterModel();
  DeptId: any;
  StatusData: any;
  //#endregion

  //#region "constructor"

  constructor(private util: UtilService, private fb: FormBuilder, public dialog: MatDialog, private MasterBillingEditService: billingService, public customhttp: CustomHttpService, public dialogRef: MatDialogRef<EditBillingMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.MasterBillingEditForm = this.fb.group({
      DepartmentID: ['',Validators.required],
      OrderNo: ['',Validators.required],
      BillingTypeDesc: [''],
      MasterBillingType: ['',Validators.required],
      Status: ['',Validators.required],
      AllowSubMaster: [''],
    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.setMasterBilling();
    this.getStatus();
  }
    //#endregion


  //#region "Getting-Status Data"

  getStatus() {
    this.MasterBillingEditService.GetBillingStatus().then(data => {
      this.StatusData = data;
    });
  }
  //#endregion

  //#region "Set-Data"

  setMasterBilling() {
    this.MasterBillingEditForm.get('DepartmentID').setValue(this.data.DepartmentName);
    this.MasterBillingEditForm.get('MasterBillingType').setValue(this.data.MasterBillingType);
    this.MasterBillingEditForm.get('BillingTypeDesc').setValue(this.data.BillingTypeDesc);
    this.MasterBillingEditForm.get('AllowSubMaster').setValue(this.data.AllowSubMaster);
    this.MasterBillingEditForm.get('Status').setValue(this.data.Status);
    this.MasterBillingEditForm.get('OrderNo').setValue(this.data.OrderNo);
  }
  //#endregion

  //#region "submitData"

  submitData() {
    if(this.MasterBillingEditForm.valid){
      this.BillMasterModel.DepartmentID = this.data.DepartmentID;
      this.BillMasterModel.BillingMasterID = this.data.BillingMasterID;
      this.BillMasterModel.MasterBillingType = this.MasterBillingEditForm.get('MasterBillingType').value;
      this.BillMasterModel.AllowSubMaster = this.MasterBillingEditForm.get('AllowSubMaster').value;
      this.BillMasterModel.BillingTypeDesc = this.MasterBillingEditForm.get('BillingTypeDesc').value;
      this.BillMasterModel.OrderNo = parseInt(this.MasterBillingEditForm.get('OrderNo').value);
      this.BillMasterModel.Status = this.MasterBillingEditForm.get('Status').value;
      this.MasterBillingEditService.AddUpdateBillingMasterData(this.BillMasterModel).then(res => {
      this.util.showMessage('', 'Billing Master details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if (res === true) {
              this.dialogRef.close("Update");
            }
          }
        );
      });
    }
  }
  //#endregion


  //#region "DepartmentID"

  DepartmentId(DepartmentID) {
    this.DeptId = DepartmentID;
  }
  //#endregion



  //#region "reset"
  Clear() {
    this.setMasterBilling();
  }
  //#endregion

  //#region "dialog-close"

  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion


}
