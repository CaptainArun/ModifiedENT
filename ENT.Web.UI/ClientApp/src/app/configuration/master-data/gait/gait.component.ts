import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";

import { GaitAddComponent } from "./add-gait/add-gait.component";

@Component({
    selector: "app-gait",
      styleUrls: ["./gait.component.css"],
    templateUrl: './gait.component.html'
    })
    export class GaitComponent implements OnInit{
      //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  gaitgrid: any;
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
      { PropertyName: 'GaitMasterCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'GaitMasterDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGaitGridData();
  }
  getGaitGridData() {
    this.configurationservice.Gaitgrid().then((res) => {
      this.gaitgrid = res;
      
    }
    );
  }
  //#region "AddGait"

  addNewGait() {
    const newGait = this.MatDialog.open(GaitAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGaitGridData();
      }
    });
  }
  //#endregion

  //#region "EditGait"

  editGait(element: any) {
    this.configurationservice.Gaiteditgrid(element.Item.GaitMasterID)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(GaitAddComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGaitGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteGait"
  DeleteGait(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteGait(element.Item.GaitMasterID).then((res) => {
            this.getGaitGridData();
          });
        }
      });
  }
  //#endregion

        
    }

