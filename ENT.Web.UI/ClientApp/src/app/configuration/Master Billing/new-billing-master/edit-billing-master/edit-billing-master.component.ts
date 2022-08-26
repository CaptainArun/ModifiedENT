import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BillingMasterModel } from '../../../Models/BillingMasterModel';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../../configuration.service';
import { CustomHttpService } from '../../../../core/custom-http.service';


@Component({
  selector: 'app-edit-billing-master',
  templateUrl: './edit-billing-master.component.html',
  styleUrls: ['./edit-billing-master.component.css']
})
export class EditBillingMasterComponent implements OnInit {

  MasterBillingEditForm: FormGroup;
  DepartmentInfo: any;
  BillMasterModel: BillingMasterModel = new BillingMasterModel();
  constructor(private fb: FormBuilder, public dialog: MatDialog, private MasterBillingEditService: ConfigurationService, public customhttp: CustomHttpService, public dialogRef:   MatDialogRef<EditBillingMasterComponent> , @Inject(MAT_DIALOG_DATA) public data: any) {}      

  ngOnInit() {


    this.MasterBillingEditForm = this.fb.group({

      DepartmentID: [''],
      OrderNo: [''],
      BillingTypeDesc: [''],
      MasterBillingType: [''],
      Status: [''],
      AllowSubMaster: [''],


    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.setMasterBilling();
  }



  submitData() {
   this.BillMasterModel.BillingMasterID = 1;

    this.BillMasterModel.MasterBillingType = this.MasterBillingEditForm.get('MasterBillingType').value;
    this.BillMasterModel.AllowSubMaster = this.MasterBillingEditForm.get('AllowSubMaster').value;
    this.BillMasterModel.DepartmentID = this.MasterBillingEditForm.get('DepartmentID').value;
    this.BillMasterModel.BillingTypeDesc = this.MasterBillingEditForm.get('BillingTypeDesc').value;
    this.BillMasterModel.OrderNo = parseInt(this.MasterBillingEditForm.get('OrderNo').value);
    this.BillMasterModel.Status = this.MasterBillingEditForm.get('Status').value;

    this.MasterBillingEditService.AddUpdateBillingMasterData(this.BillMasterModel).then(data => {


    });


    this.dialogClose();

  }

 

  setMasterBilling() {

    this.MasterBillingEditForm.get('DepartmentID').setValue(this.data.DepartmentID);
    this.MasterBillingEditForm.get('MasterBillingType').setValue(this.data.MasterBillingType);
    this.MasterBillingEditForm.get('BillingTypeDesc').setValue(this.data.BillingTypeDesc);
    
    this.MasterBillingEditForm.get('AllowSubMaster').setValue(this.data.AllowSubMaster);
    this.MasterBillingEditForm.get('Status').setValue(this.data.Status);
    this.MasterBillingEditForm.get('OrderNo').setValue(this.data.OrderNo);
    
  }


  dialogClose(): void {
    this.dialogRef.close();
  }


}
