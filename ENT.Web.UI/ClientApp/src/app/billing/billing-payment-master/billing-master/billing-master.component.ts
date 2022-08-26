import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableConfig } from '../../../ux/columnConfig';
import { MatDialog} from '@angular/material';
import { CustomHttpService } from '../../../core/custom-http.service';
import { Router } from "@angular/router";
import { UtilService } from '../../../core/util.service';
import { AddBillingMasterComponent } from "./add-billing-master/add-billing-master.component";
import { billingService } from "../../billing.service";
import { ViewBillingMasterComponent } from "./view-billing-master/view-billing-master.component";
import { EditBillingMasterComponent } from "./edit-billing-master/edit-billing-master.component";




@Component({
    selector: 'app-billing-master',
    templateUrl: './billing-master.component.html',
    styleUrls: ['./billing-master.component.css']
  })

  export class billingMasterComponent implements OnInit {

   //#region "Property Declaration"
    identify: any;
    tableConfig: TableConfig = new TableConfig();
  //#endregion

    //#region "constructor"
    constructor(private fb: FormBuilder, public dialog: MatDialog, private billingSvc: billingService, public customhttp: CustomHttpService, private router: Router,private util: UtilService) {
       this.tableConfig.showPagination = true;
         this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
      this.tableConfig.showDelete = false;

      this.tableConfig.columnConfig = [
          { PropertyName: 'DepartmentName', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'BillingTypeDesc', DisplayName: 'Description', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'MasterBillingType', DisplayName: 'Master BillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'AllowSubMaster', DisplayName: 'Allow SubMaster', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          ];     
  }
    //#endregion

  //#region "ngOnInit"
    ngOnInit() {
    
          this.customhttp.getDbName(localStorage.getItem('DatabaseName'));
          this.getBillingMasterList();
          
    }
  //#endregion

   //#region "Bind Table Data"
// set data from char to String in Table
  onBindItem(event: any) { 
      
    if (event.Item) {     
      if (event.Item.AllowSubMaster == true) {
        event.Item.AllowSubMaster = "Yes";
      }
      else if(event.Item.AllowSubMaster == false) {
        event.Item.AllowSubMaster = "No";      
    }
    else{
      event.Item.AllowSubMaster = "Unknown";
  }
}
  }
  //#endregion
  
   //#region "addNew"
    addNew() {
      const newBalance = this.dialog.open(AddBillingMasterComponent, {
        height: "auto",
        width: "auto",
        autoFocus: false,
      });
      newBalance.afterClosed().subscribe((result) => {
        if (result == "Update") {
          this.getBillingMasterList();
        }
      });
    }
//#endregion

  //#region "Delete"
  //  DeleteRecord(element: any) {

  //    this.billingSvc.DeleteBillingMasterRecord(element.Item.BillingMasterID).then(data => {
  //      this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
  //        (res) => {
  //          if (res === true) {
  //            this.getBillingMasterList();
  //          }
  //         }  );
  
  //    });
  //}
  //#endregion

  //#region "view"
     ViewMasterBilling(element: any) {
      this.billingSvc.GetBillingMasterRecordbyID(element.Item.BillingMasterID).then(data => {
       let MasterBillingService = data;
       MasterBillingService.AllowSubMaster=data.AllowSubMaster  ?"yes":"No";

        const dialogRef = this.dialog.open(ViewBillingMasterComponent, {
          data: MasterBillingService,
          height: 'auto',
          width: '1200px',
          autoFocus: true,
        });
     });
  
    }
    //#endregion

   //#region "Edit"
    EditRecord(element: any) {
      this.billingSvc.GetBillingMasterRecordbyID(element.Item.BillingMasterID).then(data => {
        let MasterBilling = data;
         const dialogRef = this.dialog.open(EditBillingMasterComponent, {
           data: MasterBilling,
           height: 'auto',
           width: 'auto',
           autoFocus: false,
         });
         dialogRef.afterClosed().subscribe((result) => {           
          if (result == "Update") {
            this.getBillingMasterList();
          }
        });
       });
     }
      //#endregion

   //#region "Grid Data"
     getBillingMasterList() {
      this.billingSvc.GetBillingMasterList().then(res => {
      this.identify = res;
      })
    }
  //#endregion
  }
