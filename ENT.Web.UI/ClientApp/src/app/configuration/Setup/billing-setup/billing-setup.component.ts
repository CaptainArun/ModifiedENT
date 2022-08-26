
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { BillingSetupModel } from '../../Models/BillingSetupModel';
import { TableConfig } from '../../../ux/columnConfig';
import { ConfigurationService } from '../../configuration.service';
import { ViewBillingSetupComponent } from './view-billing-setup/view-billing-setup.component';
import { EditBillingSetupComponent } from './edit-billing-setup/edit-billing-setup.component';


@Component({
  selector: 'app-billing-setup',
  templateUrl: './billing-setup.component.html',
  styleUrls: ['./billing-setup.component.css']
})
export class BillingSetupComponent implements OnInit {

  BillingSetupForm: FormGroup;

  tableConfig: TableConfig = new TableConfig();

  BillingSetupModel: BillingSetupModel = new BillingSetupModel();

  DepartmentInfo: any;

  subIdentify: any;
  BillMasterID: any;
  identify: any;
  departID: any;
  MasterBillID: any;
  MasterBillingTypInfo: any;

  SubMasterBillingTypInfo: any;
  DeptId: any;

  SetupIdentify: any;

  
  

  constructor(private fb: FormBuilder, public dialog: MatDialog, private BillingSetupService: ConfigurationService, public customhttp: CustomHttpService) {
    this.tableConfig.showPagination = false;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;

    this.tableConfig.columnConfig = [

      { PropertyName: 'DepartmentName', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'MasterBillingTypeName', DisplayName: 'MasterBillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'SubMasterBillingType', DisplayName: 'SubMasterBillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },

      { PropertyName: 'AllowDiscount', DisplayName: 'AllowDiscount', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AllowPartialPayment', DisplayName: 'AllowPartialPayment', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'UserTypeBilling', DisplayName: 'UserTypeBilling', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'UserType', DisplayName: 'UserType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Charges', DisplayName: 'Charges', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AcceptedPaymentMode', DisplayName: 'AcceptedPaymentMode', DisplayMode: 'Text', LinkUrl: '', isVisible: true },

    ]
  }

  ngOnInit() {

    this.BillingSetupForm = this.fb.group({


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
    this.GetSubmasterBillingtype();
    this.MasterCodeBillingtype();
   this.GetBillingSubMasterList();
    
    
    this.GetDepartmentCodeList();

  }



  submitData() {
    this.BillingSetupModel.DepartmentID = this.departID;
    this.BillingSetupModel.MasterBillingType = this.MasterBillID;
    
    this.BillingSetupModel.SubMasterBillingType = this.BillingSetupForm.get('SubMasterBillingType').value;
   
    this.BillingSetupModel.AllowDiscount = (this.BillingSetupForm.get('AllowDiscount').value);
    this.BillingSetupModel.OrderNo = (this.BillingSetupForm.get('OrderNo').value);
    this.BillingSetupModel.Status = (this.BillingSetupForm.get('Status').value);
    this.BillingSetupModel.AllowPartialPayment = (this.BillingSetupForm.get('AllowPartialPayment').value);
    this.BillingSetupModel.UserTypeBilling = (this.BillingSetupForm.get('UserTypeBilling').value);

    this.BillingSetupModel.UserType = (this.BillingSetupForm.get('UserType').value);
    this.BillingSetupModel.Charges = parseInt(this.BillingSetupForm.get('Charges').value);
    this.BillingSetupModel.AcceptedPaymentMode = this.BillingSetupForm.get('AcceptedPaymentMode').value;



    this.BillingSetupService.AddUpdateBillingSetupMasterData(this.BillingSetupModel).then(res => {


      this.GetAllSetupMasterData();

    })



  }


  masterbillingID(BillingMasterID: number) {

    this.MasterBillID = BillingMasterID;

  }


 GetAllSetupMasterData() {


    this.BillingSetupService.GetAllSetupMasterData().then(res => {

      this.SetupIdentify = res;

    })
  }







  GetDepartmentCodeList() {


    this.BillingSetupForm.get('DepartmentID').valueChanges.subscribe((key: string) => {

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


  MasterCodeBillingtype() {
    this.BillingSetupForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {

          this.BillingSetupService.getSubMasterBillingTypesforMasterBillingType(this.DeptId, key).then(data => {
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
    this.BillingSetupForm.get('SubMasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {


          this.BillingSetupService.SubMasterBillingTypesforMasterBillingType(this.BillMasterID, key).then(data => {
            this.SubMasterBillingTypInfo = data;

            


          })
        }
      }
    })

  }

 

  departmentID(DepartmentID: number) {

    this.departID = DepartmentID;

  }

  ViewSetupBilling(element: any) {
    this.BillingSetupService.GetSetupMasterRecordbyID(element.Item.SetupMasterID).then(data => {

      let SetupBilling = data;

      const dialogRef = this.dialog.open(ViewBillingSetupComponent, {
       
        data: SetupBilling,
        height: '300px',
        width: '1200px',
        autoFocus: true,
      });
    });

  }

  EditSetupBilling(element: any) {
    this.BillingSetupService.GetSetupMasterRecordbyID(element.Item.SetupMasterID).then(data => {

      
      let SetupMasterBilling = data;

      const dialogRef = this.dialog.open(EditBillingSetupComponent, {
        data: SetupMasterBilling,
        height: '300px',
        width: 'auto',
        autoFocus: true,
      });



   });
  }


  DeleteSetupBilling(element: any) {



    this.BillingSetupService.DeleteSetUpMasterRecord(element.Item.SetupMasterID).then(data => {

    })
  }
}
