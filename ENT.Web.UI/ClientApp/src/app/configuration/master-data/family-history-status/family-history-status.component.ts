import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addFamilyHistoryStatusComponent } from './add-family-history-status/add-family-history-status.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-familyhistoryStatusComponent",
  styleUrls: ["./family-history-status.component.css"],
  templateUrl: './family-history-status.component.html'
})

export class FamilyHistoryStatusComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  familygrid: any;
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
      { PropertyName: 'FamilyHistoryStatusCode', DisplayName: 'code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'FamilyHistoryStatusDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'OrderNo', DisplayMode: "Order", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getfamilyhistorystatusGridData();
  }
  getfamilyhistorystatusGridData() {
    this.configurationservice.familycategorygrid().then((res) => {
      this.familygrid = res;
    }
    );
  }
  //#region "AddFamilyhistory"

  addNewdrinking() {
    const newfamilyhistory = this.MatDialog.open(addFamilyHistoryStatusComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newfamilyhistory.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getfamilyhistorystatusGridData();
      }
    });
  }
  //#endregion

  //#region "Editfamily"

  editfamilyhistory(element: any) {
    this.configurationservice.familyeditgridcategory(element.Item.FamilyHistoryStatusID)
      .then((res) => {
        var editFamily = res;
        let editDetailsofFamily = this.MatDialog.open(addFamilyHistoryStatusComponent, {
          data: editFamily,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofFamily.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getfamilyhistorystatusGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteFamily"
  deletefamilyhistory(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletedfamilycategory(element.Item.FamilyHistoryStatusID).then((res) => {
            this.getfamilyhistorystatusGridData();
          });
        }
      });
  }
  //#endregion

}
