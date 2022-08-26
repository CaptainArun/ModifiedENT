import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addPaymentTypeComponent } from "./add-payment-type/add-payment-type.component";

@Component({
    selector: "app-paymentTypeComponent",
      styleUrls: ["./payment-type.component.css"],
    templateUrl: './payment-type.component.html'
    })
export class paymentTypeComponent implements OnInit{
//#region "Property Declaration"
  tableConfig: TableConfig = new TableConfig;
  gridData: any;
  //#endregion

//#region "constructor"

  constructor(private config: UtilService, public MatDialog: MatDialog, public CustHttp: CustomHttpService, public configurationservice: ConfigurationService,) {

    this.tableConfig.showPagination = true;
    this.tableConfig.showView = false;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.showOpen = false;

    this.tableConfig.columnConfig = [
      { PropertyName: 'PaymentTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'PaymentTypeDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

//#region ngOnInit
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGridDataForPaymentType();
  }
//#endregion ngOnInit

//#region Grid Data
  getGridDataForPaymentType() {
    this.configurationservice.getGridDataForPaymentType().then((res) => {
      this.gridData = res;      
    });
  }
//#endregion Grid Data
 
//#region "add"

  addNew() {
    const newGait = this.MatDialog.open(addPaymentTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGridDataForPaymentType();
      }
    });
  }
  //#endregion

//#region "edit"

  edit(element: any) {
    this.configurationservice.editRecordOfPaymentType(element.Item.PaymentTypeId)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(addPaymentTypeComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGridDataForPaymentType();
          }
        });
      });
  }
  //#endregion

//#region "Delete"
  Delete(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleteRecordOfPaymentType(element.Item.PaymentTypeId).then((res) => {
            this.getGridDataForPaymentType();
          });
        }
      });
  }
  //#endregion
}

