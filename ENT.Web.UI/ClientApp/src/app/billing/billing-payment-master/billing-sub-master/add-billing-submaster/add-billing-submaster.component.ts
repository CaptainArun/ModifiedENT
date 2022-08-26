import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from "@angular/router";
import { CustomHttpService } from "../../../../core/custom-http.service";
import { UtilService } from "../../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../../ux/bmsmsgbox/bmsmsgbox.component";
import { billingService } from "../../../billing.service";
import { BillingSubMasterModel } from "../../../models/BilllingSubMasterModel";
@Component({
  selector: 'app-add-billing-submaster',
  templateUrl: './add-billing-submaster.component.html',
  styleUrls: ['./add-billing-submaster.component.css']
})

export class AddBillingSubMasterComponent implements OnInit,AfterViewInit {

  //#region "Property Declaration"
  SubMasterBillingForm: FormGroup;
  MasterBillingTypInfo: any;
  BillSubMasterModel: BillingSubMasterModel = new BillingSubMasterModel();
  departID: any;
  MasterBillID: any;
  DepartmentInfo: any;
  StatusData: any;
  @ViewChild('autoCompleteDepartment', { static: false, read: MatAutocompleteTrigger })DepartmentAutotrigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteBillingType', { static: false, read: MatAutocompleteTrigger })BillingTypeAutotrigger: MatAutocompleteTrigger;

  //#endregion
  // LabSubMasterModel: LabSubMasterModel = new LabSubMasterModel();
    //#region "constructor"
  constructor(private fb: FormBuilder, public dialog: MatDialogRef<AddBillingSubMasterComponent>, private billingSvc: billingService, public customhttp: CustomHttpService, private router: Router, private util: UtilService, @Inject(MAT_DIALOG_DATA) public data,) { }
   //#endregion

  //#region "ngOnInit"
    ngOnInit() {
    this.SubMasterBillingForm = this.fb.group({
      DepartmentID: ['',Validators.required],
      MasterBillingType: ['',Validators.required],
      SubMasterBillingTypeDesc: [''],
      Status: ['',Validators.required],
      SubMasterBillingType: ['',Validators.required],
      OrderNo: ['',Validators.required],

    });
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.GetBillingtype();
    this.GetDepartmentCodeList();
    this.getStatus();
    this.SubMasterBillingForm.get('MasterBillingType').disable();
  }
//#endregion

    //#region "Getting-Status Data"


    ngAfterViewInit() {

      this.DepartmentAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.SubMasterBillingForm.get('DepartmentID').setValue('');
        }
      });

      this.BillingTypeAutotrigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.SubMasterBillingForm.get('MasterBillingType').setValue('');
        }
      });

    }
  getStatus() {
    this.billingSvc.GetBillingStatus().then(data => {
      this.StatusData = data;
    });
  }
    //#endregion

  //#region "Get-DepartmentValue"
  GetDepartmentCodeList() {
    this.SubMasterBillingForm.get('DepartmentID').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.billingSvc.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;
          });
        }
        else {
          this.DepartmentInfo = null;
          this.disableMasterBillingType();
        }
      } 
      else {
        this.DepartmentInfo = null;
        this.disableMasterBillingType();
      }
    });
  }
  //#endregion

disableMasterBillingType(){
  this.SubMasterBillingForm.get('MasterBillingType').setValue("");
  this.SubMasterBillingForm.get('MasterBillingType').disable();
}

  //#region "Get-DepartmentID"
  departmentID(DepartmentID: number) {
    this.departID = DepartmentID;
    this.DepartmentInfo = null;
    this.SubMasterBillingForm.get('MasterBillingType').markAsUntouched();
    this.SubMasterBillingForm.get('MasterBillingType').enable();
  }
  //#endregion


  //#region "Get-BillingMasterID"

  masterbillingID(BillingMasterID: number){
    this.MasterBillID = BillingMasterID;
    this.MasterBillingTypInfo = null;
  }

  //#endregion

  //#region "Get-Billingtype Data"
  GetBillingtype() {
    this.SubMasterBillingForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.billingSvc.GetSubMasterallowedBillingTypes(this.departID, key).then(data => {
            this.MasterBillingTypInfo = data;
          })
        } else {
          this.MasterBillingTypInfo = null;
        }
      }else {
        this.MasterBillingTypInfo = null;
      }


    });
  }
  //#endregion

  //#region "submitData"
  submitData() {
    if( this.SubMasterBillingForm.valid){
      this.BillSubMasterModel.DepartmentID = this.departID;
      this.BillSubMasterModel.MasterBillingType = this.MasterBillID;
      this.BillSubMasterModel.Status = this.SubMasterBillingForm.get('Status').value;
      this.BillSubMasterModel.SubMasterBillingType = this.SubMasterBillingForm.get('SubMasterBillingType').value;
      this.BillSubMasterModel.OrderNo = parseInt(this.SubMasterBillingForm.get('OrderNo').value);
      this.BillSubMasterModel.SubMasterBillingTypeDesc = this.SubMasterBillingForm.get('SubMasterBillingTypeDesc').value;
     this.billingSvc.AddUpdateBillingSubMasterData(this.BillSubMasterModel).then(res => {
        this.util.showMessage('', 'Billing SubMaster details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => {
            if (res === true) {
              this.dialog.close("Update");
            }
          }
        );
      });
    }
  }
//#endregion

//#region "reset"
  Clear() {
    this.SubMasterBillingForm.reset();
    this.SubMasterBillingForm.get('MasterBillingType').disable();
  }
//#endregion

//#region "dialog-close"
  close() {
    this.dialog.close();
  }
    //#endregion

}
