import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { BillingMasterModel } from '../../Models/BillingMasterModel';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../configuration.service';
import { TableConfig } from '../../../ux/columnConfig';
import { ViewBillingMasterComponent } from './view-billing-master/view-billing-master.component';
import { EditBillingMasterComponent } from './edit-billing-master/edit-billing-master.component';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../../core/util.service';

@Component({
  selector: 'app-new-billing-master',
  templateUrl: './new-billing-master.component.html',
  styleUrls: ['./new-billing-master.component.css']
})
export class NewBillingMasterComponent implements OnInit {
  
  identify: any;
  /*Status = [1, 2];*/
  MasterBillingForm: FormGroup;

  BillMasterModel: BillingMasterModel = new BillingMasterModel();

  tableConfig: TableConfig = new TableConfig();
  isVisible?: boolean;

  DepartmentInfo: any;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private MasterBillingService: ConfigurationService, public customhttp: CustomHttpService, private router: Router,  private util: UtilService) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;


    this.tableConfig.columnConfig = [

      { PropertyName: 'DepartmentName', DisplayName: 'DepartmentID', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'BillingTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'MasterBillingType', DisplayName: 'MasterBillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'AllowSubMaster', DisplayName: 'AllowSubMaster', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },


      ]



  }

  ngOnInit() {


    this.MasterBillingForm = this.fb.group({

      DepartmentID: [''],
      OrderNo: [''],
      BillingTypeDesc: [''],
      MasterBillingType: [''],
      Status: [''],
      AllowSubMaster: [''],


    })

    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getBillingMasterList();

    this.GetDepartmentCodeList();

   //this.GetDepartmentsList();
  }


  submitData() {
    /*this.BillMasterModel.BillingMasterID = 1;*/

    this.BillMasterModel.MasterBillingType = this.MasterBillingForm.get('MasterBillingType').value;
    this.BillMasterModel.AllowSubMaster = this.MasterBillingForm.get('AllowSubMaster').value;
    this.BillMasterModel.DepartmentID = this.MasterBillingForm.get('DepartmentID').value;
    this.BillMasterModel.BillingTypeDesc = this.MasterBillingForm.get('BillingTypeDesc').value;
    this.BillMasterModel.OrderNo = parseInt(this.MasterBillingForm.get('OrderNo').value);
    this.BillMasterModel.Status = this.MasterBillingForm.get('Status').value;

    this.MasterBillingService.AddUpdateBillingMasterData(this.BillMasterModel).then(data => {
      this.util.showMessage('', 'Billing Master details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => { }
      );
      this.getBillingMasterList();
    });



  }


  getBillingMasterList() {

    
    this.MasterBillingService.GetBillingMasterList().then(res => {

      this.identify = res;

    })
  }



  DeletePhysicalExamRecord(element: any) {

    this.MasterBillingService.DeleteBillingMasterRecord(element.Item.BillingMasterID).then(data => {

    })
  }

  ViewMasterBilling(element: any) {
    this.MasterBillingService.GetBillingMasterRecordbyID(element.Item.BillingMasterID).then(data => {

     let MasterBillingService = data;
      const dialogRef = this.dialog.open(ViewBillingMasterComponent, {
        data: MasterBillingService,
        height: '300px',
        width: '1200px',
        autoFocus: true,
      });
   });

  }

EditPhysicalExamRecord(element: any) {
   this.MasterBillingService.GetBillingMasterRecordbyID(element.Item.BillingMasterID).then(data => {
     let MasterBilling = data;
      const dialogRef = this.dialog.open(EditBillingMasterComponent, {
        data: MasterBilling,
        height: 'auto',
        width: 'auto',
        autoFocus: false,
      });
     
     this.getBillingMasterList();
    

    });
  }




 GetDepartmentCodeList() {

   this.MasterBillingForm.get('DepartmentID').valueChanges.subscribe((key: string) => {
      
      if (key != null) {
        if (key.length > 2) {
          this.MasterBillingService.GetDepartmentsList(key).then(data => {
            this.DepartmentInfo = data;

          })
        }
      }
    })
  }




}
