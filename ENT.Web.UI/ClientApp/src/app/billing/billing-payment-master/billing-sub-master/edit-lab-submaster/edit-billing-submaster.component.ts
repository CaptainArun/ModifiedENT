import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { UtilService } from '../../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../../ux/bmsmsgbox/bmsmsgbox.component';
import { billingService } from '../../../billing.service';
import { BillingSubMasterModel } from '../../../models/BilllingSubMasterModel';

@Component({
    selector: 'app-edit-billing-submaster',
    templateUrl: './edit-billing-submaster.component.html',
    styleUrls: ['./edit-billing-submaster.component.css']
  })

  export class EditBillingSubMasterComponent implements OnInit {

  //#region "Property Declaration"
    SubMasterEditBillingForm: FormGroup;
    BillSubMasterModel: BillingSubMasterModel = new BillingSubMasterModel();
    MasterBillID: any;
    DepartmentInfo: any;
    MasterBillingTypInfo: any;
    DeptId: any;
    StatusData: any;
    //#endregion

    //#region "constructor"
    constructor(private util: UtilService,private fb: FormBuilder, public dialog: MatDialog, private SubMasterBillingEditService: billingService, public customhttp: CustomHttpService, public dialogRef: MatDialogRef<EditBillingSubMasterComponent> , @Inject(MAT_DIALOG_DATA) public data: any ) { }
    //#endregion

  //#region "ngOnInit"
    ngOnInit() {
      this.SubMasterEditBillingForm = this.fb.group({
        DepartmentID: ['',Validators.required],
        MasterBillingType: ['',Validators.required],
        SubMasterBillingTypeDesc: [''],
        Status: ['',Validators.required],
        SubMasterBillingType: ['',Validators.required],
        OrderNo: ['',Validators.required],
  
      })
  
      this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
      this.SetSubmasterBilling();
      this.GetDepartmentCodeList();
      this.getStatus();

    }
  //#endregion

        //#region "Getting-Status Data"

    getStatus() {
      this.SubMasterBillingEditService.GetBillingStatus().then(data => {
        this.StatusData = data;        
      });
    }
        //#endregion


       //#region "Getting-Status Data"

    SetSubmasterBilling() {  
      this.SubMasterEditBillingForm.get('DepartmentID').setValue(this.data.DepartmentName);
      this.SubMasterEditBillingForm.get('MasterBillingType').setValue(this.data.MasterBillingTypeName);
      this.SubMasterEditBillingForm.get('SubMasterBillingTypeDesc').setValue(this.data.SubMasterBillingTypeDesc);
      this.SubMasterEditBillingForm.get('Status').setValue(this.data.Status);
      this.SubMasterEditBillingForm.get('SubMasterBillingType').setValue(this.data.SubMasterBillingType);
      this.SubMasterEditBillingForm.get('OrderNo').setValue(this.data.OrderNo);
    }
        //#endregion

  
    //#region "Get-DepartmentValue"
    GetDepartmentCodeList() {
      this.SubMasterEditBillingForm.get('DepartmentID').valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.SubMasterBillingEditService.GetDepartmentsList(key).then(data => {
              this.DepartmentInfo = data;
              })
          } else {
            this.DepartmentInfo = null;
          }
        }
      });
    }
  //#endregion


  //#region "Get-DepartmentID"
    departmentID(DepartmentID: number) {
      this.DeptId = DepartmentID;
    }
    //#endregion

    
  //#region "Get-BillingMasterID"
    masterbillingID(BillingMasterID: number) {
      this.MasterBillID = BillingMasterID;
    }
  //#endregion



    //#region "Get-Billingtype Data"
    GetBillingtype() {
      this.SubMasterEditBillingForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {
  
        if (key != null) {
          if (key.length > 2) {
  
            this.SubMasterBillingEditService.GetSubMasterallowedBillingTypes(this.DeptId, key).then(data => {
              this.MasterBillingTypInfo = data;
            })
          } else {
            this.MasterBillingTypInfo = null;
          }
        }
      });
    }
    //#endregion


  //#region "submitData"
    submitData() {
      if(this.SubMasterEditBillingForm.valid){
        this.BillSubMasterModel.DepartmentID = this.data.DepartmentID;
        this.BillSubMasterModel.MasterBillingType = this.data.MasterBillingType;
        this.BillSubMasterModel.Status = this.SubMasterEditBillingForm.get('Status').value;
        this.BillSubMasterModel.SubMasterBillingType = this.SubMasterEditBillingForm.get('SubMasterBillingType').value;
        this.BillSubMasterModel.OrderNo = parseInt(this.SubMasterEditBillingForm.get('OrderNo').value);
        this.BillSubMasterModel.SubMasterBillingTypeDesc = this.SubMasterEditBillingForm.get('SubMasterBillingTypeDesc').value;
        
          this.SubMasterBillingEditService.AddUpdateBillingSubMasterData(this.BillSubMasterModel).then(res => {
          this.util.showMessage('', 'Billing SubMaster details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
            (res) => {
              if (res === true) {
                this.dialogRef.close("Update");            }
             }
          );
        });
      }
    }
    //#endregion


  //#region "reset"
    Clear(){
      this.SetSubmasterBilling();
    }
  //#endregion


  //#region "dialog-close"
    dialogClose(): void {
      this.dialogRef.close();
    }
  //#endregion

  }
