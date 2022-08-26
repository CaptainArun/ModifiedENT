import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CustomHttpService } from '../../../core/custom-http.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { TableConfig } from '../../../ux/columnConfig';
import { billingService } from '../../billing.service';
import { AddBillingSubMasterComponent } from './add-billing-submaster/add-billing-submaster.component';
import { EditBillingSubMasterComponent } from './edit-lab-submaster/edit-billing-submaster.component';
import { ViewBillingSubMasterComponent } from './view-lab-submaster/view-billing-submaster.component';

@Component({
    selector: 'app-billing-sub-master',
    templateUrl: './billing-sub-master.component.html',
    styleUrls: ['./billing-sub-master.component.css']
  })
export class BillingSubMasterComponent implements OnInit {

   //#region "Property Declaration"
        subIdentify: any;
        tableConfig: TableConfig = new TableConfig();
  //#endregion

     //#region "constructor"
    constructor(private util: UtilService,private fb: FormBuilder, public dialog: MatDialog, private billingSvc: billingService, public customhttp: CustomHttpService, private router: Router) {

      this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = false;
    
    
        this.tableConfig.columnConfig = [
      { PropertyName: 'DepartmentName', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'MasterBillingTypeName', DisplayName: 'Master Billing', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'SubMasterBillingType', DisplayName: 'SubMaster Billing', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'SubMasterBillingTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
      { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
        ];   
  }
   //#endregion

  //#region "ngOnInit"
    ngOnInit() {
  
    this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
    this.GetBillingSubMasterList();
  }
  //#endregion

//#region "addNew"
addNew() {
  const newBalance = this.dialog.open(AddBillingSubMasterComponent, {
    height: "auto",
    width: "auto",
    autoFocus: false,
  });
  newBalance.afterClosed().subscribe((result) => {
    if (result == "Update") {
      this.GetBillingSubMasterList();
    }
  });
  }
    //#endregion

  //#region "Delete"
//DeleteSubMasterBilling(element: any) {

 
//  this.billingSvc.DeleteBillingSubMasterRecord(element.Item.BillingSubMasterID).then(data => {
    
//    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
//      (res) => {
//        if (res === true) {
//          this.GetBillingSubMasterList();
//        }
//       });
//  })
//  }
      //#endregion

//#region "View"
ViewSubMasterBilling(element: any) {
  this.billingSvc.GetBillingSubMasterRecordbyID(element.Item.BillingSubMasterID).then(data => {
    let SubMasterBillingService = data;
    const dialogRef = this.dialog.open(ViewBillingSubMasterComponent, {
      data: SubMasterBillingService,
      height: 'auto',
      width: '1200px',
      autoFocus: true,
    });
  });
}
      //#endregion

//#region "Edit"
EditSubMasterBilling(element: any) {
  this.billingSvc.GetBillingSubMasterRecordbyID(element.Item.BillingSubMasterID).then(data => {
    let MasterBilling = data;
    const dialogRef = this.dialog.open(EditBillingSubMasterComponent, {
      data: MasterBilling,
      height: 'auto',
      width: 'auto',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "Update") {
        this.GetBillingSubMasterList();
      }
    });
  });
  }
   //#endregion

  //#region "Grid Data"
GetBillingSubMasterList() {
  this.billingSvc.GetBillingSubMasterList().then(res => {
    this.subIdentify = res;
  });
}
   //#endregion

  }
