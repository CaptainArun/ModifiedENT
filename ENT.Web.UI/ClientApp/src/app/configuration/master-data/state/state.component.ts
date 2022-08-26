import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addStateComponent } from "./add-state/add-state.component";

@Component({
    selector: "app-stateComponent",
    styleUrls: ["./state.component.css"],
    templateUrl: './state.component.html'
    })

export class stateComponent implements OnInit{

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
      
      { PropertyName: 'StateCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'StateDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGridDataForState();
  }

  //#region grid data
  getGridDataForState() {
    this.configurationservice.getGridDataForState().then((res) => {
      this.gridData = res;      
    });
  }
//#endregion grid data

  //#region "add New pop up"

  addNew() {
    const newGait = this.MatDialog.open(addStateComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGridDataForState();
      }
    });
  }
  //#endregion

  //#region "edit"

  edit(element: any) {
    this.configurationservice.editRecordOfState(element.Item.StateId)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(addStateComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGridDataForState();
          }
        });
      });
  }
  //#endregion

  //#region "deleteGait"
  Delete(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleteRecordOfState(element.Item.StateId).then((res) => {
            this.getGridDataForState();
          });
        }
      });
  }
  //#endregion
 }

