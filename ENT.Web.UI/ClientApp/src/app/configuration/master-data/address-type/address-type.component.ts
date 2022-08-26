import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addAddressTypeComponent } from "./add-address-type/add-address-type.component";

@Component({
    selector: "app-AddressTypeComponent",
    styleUrls: ["./address-type.component.css"],
    templateUrl: './address-type.component.html'
    })

export class AddressTypeComponent implements OnInit{
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
      
      { PropertyName: 'AddressTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'AddressTypeDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
//#endregion

//#region ngOnInit
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getgridData();
  }
//#endregion ngOnInit

//#region Grid Data
  getgridData() {
    this.configurationservice.gridDataAddressType().then((res) => {
      this.gridData = res;           
    }
    );
  }
//#endregion Grid Data

//#region "Add"

  addNew() {
    const newGait = this.MatDialog.open(addAddressTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getgridData();
      }
    });
  }
//#endregion

//#region "editReord"

  editReord(element: any) {
    this.configurationservice.editRecordAddressType(element.Item.AddressTypeId)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(addAddressTypeComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getgridData();
          }
        });
      });
  }
//#endregion

//#region "DeleteRecord"
  DeleteRecord(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteRecordAddressType(element.Item.AddressTypeId).then((res) => {
            this.getgridData();
          });
        }
      });
  }
//#endregion        
}

