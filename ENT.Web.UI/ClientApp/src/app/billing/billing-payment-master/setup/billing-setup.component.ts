import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { billingService } from "../../billing.service";
import { AddbillingSetupComponent } from "./add-billing-setup/add-billing-setup.component";
import { EditBillingSetupComponent } from "./edit-billing-setup/edit-billing-setup.component";
import { ViewBillingSetupComponent } from "./view-billing-setup/view-billing-setup.component";

@Component({
    selector: 'app-billing-setup',
    templateUrl: './billing-setup.component.html',
    styleUrls: ['./billing-setup.component.css']
  })
export class BillingSetupComponent implements OnInit {

 //#region "Property Declaration"
    SetupIdentify: any;
    tableConfig: TableConfig = new TableConfig();
  //#endregion

   //#region "constructor"
        constructor(private util: UtilService, public dialog: MatDialog, public CustHttp: CustomHttpService, public billingSvc: billingService,) {

        this.tableConfig.showPagination = true;
        this.tableConfig.showView = true;
        this.tableConfig.showIcon = false;
        this.tableConfig.showEdit = true;
        this.tableConfig.showAdd = false;
        this.tableConfig.showDelete = false;
    
    
        this.tableConfig.columnConfig = [
      
          { PropertyName: 'DepartmentName', DisplayName: 'Department', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'MasterBillingTypeName', DisplayName: 'Master BillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'SubMasterBillingType', DisplayName: 'SubMaster BillingType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'AllowDiscount', DisplayName: 'AllowDiscount', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Status', DisplayName: 'Status', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
         // { PropertyName: 'AllowPartialPayment', DisplayName: 'Allow PartialPayment', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
        //  { PropertyName: 'UserTypeBilling', DisplayName: 'UserType Billing', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
         // { PropertyName: 'UserType', DisplayName: 'UserType', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'Charges', DisplayName: 'Charges', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          { PropertyName: 'AcceptedPaymentMode', DisplayName: 'Accepted PaymentMode', DisplayMode: 'Text', LinkUrl: '', isVisible: true },
          ];    
  }
    //#endregion

  //#region "ngOnInit"
      ngOnInit() {
        this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
        this.GetAllSetupMasterData();
  }
      //#endregion

    //#region "Bind Table Data"
// set data from char to String in Table
onBindItem(event: any) { 
    
  if (event.Item) {     
    if (event.Item.AllowPartialPayment == true) {
      event.Item.AllowPartialPayment = "Yes";
    }
    else if(event.Item.AllowPartialPayment == false) {
      event.Item.AllowPartialPayment = "No";      
  }
  else{
    event.Item.AllowPartialPayment = "Unknown";
}
}

if (event.Item) {     
  if (event.Item.UserTypeBilling == true) {
    event.Item.UserTypeBilling = "Yes";
  }
  else if(event.Item.UserTypeBilling == false) {
    event.Item.UserTypeBilling = "No";      
}
else{
  event.Item.UserTypeBilling = "Unknown";
}
}

if (event.Item) {     
  if (event.Item.AllowDiscount == true) {
    event.Item.AllowDiscount = "Yes";
  }
  else if(event.Item.AllowDiscount == false) {
    event.Item.AllowDiscount = "No";      
}
else{
  event.Item.AllowDiscount = "Unknown";
}
}
}
//#endregion

  //#region "Grid data"
  GetAllSetupMasterData() {
       this.billingSvc.GetAllSetupMasterData().then(res => {
          this.SetupIdentify = res;
        })
      }
  //#endregion

   //#region "View"
      ViewSetupBilling(element: any) {
        this.billingSvc.GetSetupMasterRecordbyID(element.Item.SetupMasterID).then(data => {
          let SetupBilling = data;
      SetupBilling.AllowDiscount=data.AllowDiscount  ?"yes":"No";
      SetupBilling.AllowPartialPayment=data.AllowPartialPayment ?"yes":"No";
      SetupBilling.UserTypeBilling=data.UserTypeBilling ?"yes":"No";
          const dialogRef = this.dialog.open(ViewBillingSetupComponent, {
            data: SetupBilling,
            height: 'auto',
            width: '1200px',
            autoFocus: true,
          });
        });
      }
  //#endregion

   //#region "Delete"
      //DeleteSetupBilling(element: any) {
      //  this.billingSvc.DeleteSetUpMasterRecord(element.Item.SetupMasterID).then(data => {
      //    this.util.showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox).then(
      //      (res) => {
      //        if (res === true) {
      //          this.GetAllSetupMasterData();
      //        }
      //  });
      //  })
      //}
    //#endregion

  //#region " Edit"
      EditSetupBilling(element: any) {
        this.billingSvc.GetSetupMasterRecordbyID(element.Item.SetupMasterID).then(data => {
          let SetupMasterBilling = data;
          const dialogRef = this.dialog.open(EditBillingSetupComponent, {
            data: SetupMasterBilling,
            height: 'auto',
            width: 'auto',
            autoFocus: true,
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result == "Update") {
              this.GetAllSetupMasterData();
            }
          });
       });
      }
       //#endregion

//#region "Add"
   addBillingSetup() {
    const newBilling = this.dialog.open(AddbillingSetupComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    newBilling.afterClosed().subscribe((result) => {
      if (result == "Update") {
        this.GetAllSetupMasterData();
      }
    });
  }
         //#endregion

    }
