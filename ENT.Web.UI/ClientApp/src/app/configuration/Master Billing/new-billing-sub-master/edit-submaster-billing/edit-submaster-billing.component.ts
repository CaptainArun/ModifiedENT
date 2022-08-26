import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigurationService } from '../../../configuration.service';
import { CustomHttpService } from '../../../../core/custom-http.service';
import { BillingSubMasterModel } from '../../../Models/BilllingSubMasterModel';



@Component({
  selector: 'app-edit-submaster-billing',
  templateUrl: './edit-submaster-billing.component.html',
  styleUrls: ['./edit-submaster-billing.component.css']
})
export class EditSubmasterBillingComponent implements OnInit {


  SubMasterEditBillingForm: FormGroup;
  BillSubMasterModel: BillingSubMasterModel = new BillingSubMasterModel();
  

  DepartmentID: any;
  subIdentify: any;
  MasterBillID: any;
  BillMasterID: any;
  departID: any;
  DepartmentInfo: any;
  MasterBillingTypInfo: any;
  identify: any;
  DeptId: any;
  MasterBillingTypeCol: any;



  constructor(private fb: FormBuilder, public dialog: MatDialog, private SubMasterBillingEditService: ConfigurationService, public customhttp: CustomHttpService, public dialogRef: MatDialogRef<EditSubmasterBillingComponent> , @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {



    this.SubMasterEditBillingForm = this.fb.group({



      DepartmentID: [''],
      MasterBillingType: [''],
      SubMasterBillingTypeDesc: [''],
      Status: [''],
      SubMasterBillingType: [''],
      OrderNo: [''],

    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.SetSubmasterBilling();



    this.GetBillingSubMasterList();
    this.getBillingMasterList();

   this.GetDepartmentCodeList();
  }



  masterbillingID(BillingMasterID: number) {

    this.MasterBillID = BillingMasterID;

  }

  departmentID(DepartmentID: number) {

    this.departID = DepartmentID;

  }
  SetSubmasterBilling() {

    this.SubMasterEditBillingForm.get('DepartmentID').setValue(this.data.DepartmentName);
    this.SubMasterEditBillingForm.get('MasterBillingType').setValue(this.data.MasterBillingTypeName);
    this.SubMasterEditBillingForm.get('SubMasterBillingTypeDesc').setValue(this.data.SubMasterBillingTypeDesc);
    this.SubMasterEditBillingForm.get('Status').setValue(this.data.Status);
    this.SubMasterEditBillingForm.get('SubMasterBillingType').setValue(this.data.SubMasterBillingType);
    this.SubMasterEditBillingForm.get('OrderNo').setValue(this.data.OrderNo);


  }

  submitData() {

    this.BillSubMasterModel.DepartmentID = this.departID;
    this.BillSubMasterModel.MasterBillingType = this.MasterBillID;
    this.BillSubMasterModel.Status = this.SubMasterEditBillingForm.get('Status').value;
    this.BillSubMasterModel.SubMasterBillingType = this.SubMasterEditBillingForm.get('SubMasterBillingType').value;
    this.BillSubMasterModel.OrderNo = parseInt(this.SubMasterEditBillingForm.get('OrderNo').value);
    this.BillSubMasterModel.SubMasterBillingTypeDesc = this.SubMasterEditBillingForm.get('SubMasterBillingTypeDesc').value;

    this.SubMasterBillingEditService.AddUpdateBillingSubMasterData(this.BillSubMasterModel).then(res => {



    })

    this.dialogClose();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }



  GetBillingSubMasterList() {


    this.SubMasterBillingEditService.GetBillingSubMasterList().then(res => {

      this.subIdentify = res;

    })
  }

  getBillingMasterList() {

    this.SubMasterBillingEditService.GetBillingMasterList().then(res => {

      this.identify = res;
      for (let i = 0; i < 1; i++) {

        this.DeptId = this.identify[i].DepartmentID

      }


    })
  }


  GetDepartmentCodeList() {

    this.SubMasterEditBillingForm.get('DepartmentID').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {
          this.SubMasterBillingEditService.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;

          })
        }
      }
    })


  }


  GetBillingtype() {
    this.SubMasterEditBillingForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.SubMasterBillingEditService.GetSubMasterallowedBillingTypes(this.DeptId, key).then(data => {
            this.MasterBillingTypInfo = data;

            for (let i = 0; i < data.length; i++) {

              this.BillMasterID = this.MasterBillingTypInfo[i].BillingMasterID
      
            }


          })
        }
      }
    })
  }







}
