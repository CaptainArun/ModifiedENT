import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { BillingSubMasterModel } from '../../Models/BilllingSubMasterModel';
import { ConfigurationService } from '../../configuration.service';
import { TableConfig } from '../../../ux/columnConfig';
import { ViewSubmasterBillingComponent } from './view-submaster-billing/view-submaster-billing.component';
import { EditSubmasterBillingComponent } from './edit-submaster-billing/edit-submaster-billing.component';

@Component({
  selector: 'app-new-billing-sub-master',
  templateUrl: './new-billing-sub-master.component.html',
  styleUrls: ['./new-billing-sub-master.component.css']
})
export class NewBillingSubMasterComponent implements OnInit {

  SubMasterBillingForm: FormGroup;
  DepartmentID: any;
  subIdentify: any;
  MasterBillID: any;
  BillMasterID: any;
  departID: any;
  DepartmentInfo: any;
  MasterBillingTypInfo: any;
  
  BillSubMasterModel: BillingSubMasterModel = new BillingSubMasterModel();
  identify: any;
  DeptId: any;
  tableConfig: TableConfig = new TableConfig();
  isVisible?: boolean;


  constructor(private fb: FormBuilder, public dialog: MatDialog, public customhttp: CustomHttpService, private SubmasterBillingService: ConfigurationService, private router: Router) {




    this.tableConfig.showPagination = false;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [

      { PropertyName: 'DepartmentName', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'MasterBillingTypeName', DisplayName: 'Master Billing', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'SubMasterBillingType', DisplayName: 'SubMaster Billing', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
     
      { PropertyName: 'SubMasterBillingTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },

      ]

  }

  ngOnInit() {

    

    this.SubMasterBillingForm = this.fb.group({



      DepartmentID: [''],
     MasterBillingType: [''],
      SubMasterBillingTypeDesc: [''],
      Status: [''],
      SubMasterBillingType: [''],
      OrderNo: [''],

    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));

    this.getBillingMasterList();

    this.GetBillingSubMasterList();
    this.GetBillingtype();

    this.GetDepartmentCodeList();
    
  }




  submitData() {
    this.BillSubMasterModel.DepartmentID = this.departID;
    this.BillSubMasterModel.MasterBillingType = this.MasterBillID;
    this.BillSubMasterModel.Status = this.SubMasterBillingForm.get('Status').value;
    this.BillSubMasterModel.SubMasterBillingType = this.SubMasterBillingForm.get('SubMasterBillingType').value;
    this.BillSubMasterModel.OrderNo = parseInt(this.SubMasterBillingForm.get('OrderNo').value);
    this.BillSubMasterModel.SubMasterBillingTypeDesc = this.SubMasterBillingForm.get('SubMasterBillingTypeDesc').value;
    


    this.SubmasterBillingService.AddUpdateBillingSubMasterData(this.BillSubMasterModel).then(res => {



    })


}

  /*GetBillingSubMasterList*/


  GetBillingSubMasterList() {

   
    this.SubmasterBillingService.GetBillingSubMasterList().then(res => {

      this.subIdentify = res;

    })
  }

  getBillingMasterList() {

    this.SubmasterBillingService.GetBillingMasterList().then(res => {

      this.identify= res;
      for (let i = 0; i < 1; i++) {

        this.DeptId = this.identify[i].DepartmentID

      }

      
    })
  }
  

  GetDepartmentCodeList() {

    this.SubMasterBillingForm.get('DepartmentID').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {
          this.SubmasterBillingService.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;

          })
        }
      }
    })

    
  }


  GetBillingtype() {
    this.SubMasterBillingForm.get('MasterBillingType').valueChanges.subscribe((key: string) => {

      if (key != null) {
        if (key.length > 2) {
         
          this.SubmasterBillingService.GetSubMasterallowedBillingTypes(this.DeptId,key).then(data => {
            this.MasterBillingTypInfo = data;

            for (let i = 0; i < data.length; i++) {

              this.BillMasterID = this.MasterBillingTypInfo[i].BillingMasterID
            
            }


          })
        }
      }
    })
  }



  masterbillingID(BillingMasterID :number) {

    this.MasterBillID = BillingMasterID;

  }

  departmentID(DepartmentID: number) {

    this.departID = DepartmentID;

  }










  DeleteSubMasterBilling(element: any) {



    this.SubmasterBillingService.DeleteBillingSubMasterRecord(element.Item.BillingSubMasterID).then(data => {

    })
  }

  ViewSubMasterBilling(element: any) {
    this.SubmasterBillingService.GetBillingSubMasterRecordbyID(element.Item.BillingSubMasterID).then(data => {

      let SubMasterBillingService = data;
      const dialogRef = this.dialog.open(ViewSubmasterBillingComponent, {
        data: SubMasterBillingService,
        height: '300px',
        width: '1200px',
        autoFocus: true,
      });
    });

  }

  EditSubMasterBilling(element: any) {
    this.SubmasterBillingService.GetBillingSubMasterRecordbyID(element.Item.BillingSubMasterID).then(data => {
      let MasterBilling = data;
      const dialogRef = this.dialog.open(EditSubmasterBillingComponent, {
        data: MasterBilling,
        height: '',
        width: 'auto',
        autoFocus: false,
      });



    });
  }


}
