import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { BillingSetupModel } from '../../../Models/BillingSetupModel';
import { ConfigurationService } from '../../../configuration.service';

@Component({
  selector: 'app-edit-billing-setup',
  templateUrl: './edit-billing-setup.component.html',
  styleUrls: ['./edit-billing-setup.component.css']
})
export class EditBillingSetupComponent implements OnInit {

  BillingSetupEditForm: FormGroup;

  BillingSetupModel: BillingSetupModel = new BillingSetupModel();

  SetupIdentify: any;

  DepartmentInfo: any;

  subIdentify: any;
  BillMasterID: any;
  identify: any;
  departID: any;
  MasterBillID: any;
  MasterBillingTypInfo: any;

  SubMasterBillingTypInfo: any;
  DeptId: any;

 

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<EditBillingSetupComponent>, private BillingSetupService : ConfigurationService, @Inject(MAT_DIALOG_DATA) public data: any, public customhttp: CustomHttpService) { }

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
    })


    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));

    this.GetBillingSubMasterList();
    this.GetAllSetupMasterData();

    this.getBillingMasterList();
    
    this.GetBillingtype();
    this.SetSetupBilling();
    this.GetDepartmentCodeList();
    this.GetSubmasterBillingtype();
  }




  masterbillingID(BillingMasterID: number) {

    this.MasterBillID = BillingMasterID;

  }

  departmentID(DepartmentID: number) {

    this.departID = DepartmentID;

  }


  SetSetupBilling() {


    this.BillingSetupEditForm.get('DepartmentID').setValue(this.data.DepartmentName);
    this.BillingSetupEditForm.get('MasterBillingType').setValue(this.data.BillingTypeDesc);
    this.BillingSetupEditForm.get('SubMasterBillingType').setValue(this.data.SubMasterBillingType);
    this.BillingSetupEditForm.get('Status').setValue(this.data.Status);
    this.BillingSetupEditForm.get('SubMasterBillingType').setValue(this.data.SubMasterBillingType);
    this.BillingSetupEditForm.get('AllowDiscount').setValue(this.data.AllowDiscount);
    this.BillingSetupEditForm.get('OrderNo').setValue(this.data.OrderNo);
    this.BillingSetupEditForm.get('AllowPartialPayment').setValue(this.data.AllowPartialPayment);
    this.BillingSetupEditForm.get('UserTypeBilling').setValue(this.data.UserTypeBilling);
    this.BillingSetupEditForm.get('UserType').setValue(this.data.UserType);
    this.BillingSetupEditForm.get('Charges').setValue(this.data.Charges);
    this.BillingSetupEditForm.get('AcceptedPaymentMode').setValue(this.data.AcceptedPaymentMode);


  }


  submitData() {
    this.BillingSetupModel.DepartmentID = this.departID;
    this.BillingSetupModel.MasterBillingType = this.MasterBillID;

    this.BillingSetupModel.SubMasterBillingType = this.BillingSetupEditForm.get('SubMasterBillingType').value;

    this.BillingSetupModel.AllowDiscount = (this.BillingSetupEditForm.get('AllowDiscount').value);
    this.BillingSetupModel.OrderNo = (this.BillingSetupEditForm.get('OrderNo').value);
    this.BillingSetupModel.Status = (this.BillingSetupEditForm.get('Status').value);
    this.BillingSetupModel.AllowPartialPayment = (this.BillingSetupEditForm.get('AllowPartialPayment').value);
    this.BillingSetupModel.UserTypeBilling = (this.BillingSetupEditForm.get('UserTypeBilling').value);

    this.BillingSetupModel.UserType = (this.BillingSetupEditForm.get('UserType').value);
    this.BillingSetupModel.Charges = parseInt(this.BillingSetupEditForm.get('Charges').value);
    this.BillingSetupModel.AcceptedPaymentMode = this.BillingSetupEditForm.get('AcceptedPaymentMode').value;


    this.BillingSetupService.AddUpdateBillingSetupMasterData(this.BillingSetupModel).then(res => {


      this.GetAllSetupMasterData();

    })

    this.dialogClose();

  }





  GetAllSetupMasterData() {


    this.BillingSetupService.GetAllSetupMasterData().then(res => {

      this.SetupIdentify = res;

    })
  }







  GetDepartmentCodeList() {


    this.BillingSetupEditForm.get('DepartmentID').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {
          this.BillingSetupService.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;

          })
        }
      }
    })


  }

  GetBillingSubMasterList() {


    this.BillingSetupService.GetBillingSubMasterList().then(res => {

      this.subIdentify = res;

    })
  }

  getBillingMasterList() {

    this.BillingSetupService.GetBillingMasterList().then(res => {

      this.identify = res;
      for (let i = 0; i < 1; i++) {

        this.DeptId = this.identify[i].DepartmentID

      }


    })
  }


  GetBillingtype() {
    this.BillingSetupEditForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.BillingSetupService.GetMasterBillingTypes(this.DeptId, key).then(data => {
            this.MasterBillingTypInfo = data;

            for (let i = 0; i < data.length; i++) {

              this.BillMasterID = this.MasterBillingTypInfo[i].BillingMasterID

            }

          })
        }
      }
    })

  }



  GetSubmasterBillingtype() {
    this.BillingSetupEditForm.get('SubMasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {


          this.BillingSetupService.getSubMasterBillingTypesforMasterBillingType(this.BillMasterID, key).then(data => {
            this.SubMasterBillingTypInfo = data;




          })
        }
      }
    })

  }



  dialogClose(): void {
    this.dialogRef.close();
  }

}
