import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addDrinkingStatusComponent } from './add-drinking-status/add-drinking-status.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-drinkingStatusComponent",
  styleUrls: ["./drinking-status.component.css"],
  templateUrl: './drinking-status.component.html'
})

export class DrinkingStatusComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  drinkinggrid: any;
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
      { PropertyName: 'DrinkingMasterCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'DrinkingMasterDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getdrinkingstatusGridData();
  }
  getdrinkingstatusGridData() {
    this.configurationservice.drinkingcategorygrid().then((res) => {
      this.drinkinggrid = res;
    }
    );
  }
  //#region "AddDrinking"

  addNewdrinking() {
    const newDrinking = this.MatDialog.open(addDrinkingStatusComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newDrinking.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getdrinkingstatusGridData();
      }
    });
  }
  //#endregion

  //#region "EditDrinking"

  editdrinking(element: any) {
    this.configurationservice.drinkingeditgridcategory(element.Item.DrinkingMasterID)
      .then((res) => {
        var editDrinking = res;
        let editDetailsofDrinking = this.MatDialog.open(addDrinkingStatusComponent, {
          data: editDrinking,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofDrinking.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getdrinkingstatusGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteDrinking"
  deletedrinking(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletedrinkingcategory(element.Item.DrinkingMasterID).then((res) => {
            this.getdrinkingstatusGridData();
          });
        }
      });
  }
  //#endregion

}
