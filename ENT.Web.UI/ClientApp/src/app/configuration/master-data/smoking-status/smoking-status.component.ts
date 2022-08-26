import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addSmokingStatusComponent } from './add-smoking-status/add-smoking-status.component'
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-SmokingStatusComponent",
  styleUrls: ["./smoking-status.component.css"],
  templateUrl: './smoking-status.component.html'
})

export class SmokingStatusComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  smokinggrid: any;
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
      { PropertyName: 'SmokingMasterCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'SmokingMasterDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getsmokingstatGridData();
  }
  getsmokingstatGridData() {
    this.configurationservice.Smokingcategorygrid().then((res) => {
      this.smokinggrid = res;
    }
    );
  }
  //#region "AddSmoking"

  addNewSmoking() {
    const newSmoking = this.MatDialog.open(addSmokingStatusComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newSmoking.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getsmokingstatGridData();
      }
    });
  }
  //#endregion

  //#region "EditSmoking"

  editsmoking(element: any) {
    this.configurationservice.Smokingeditgridcategory(element.Item.SmokingMasterID)
      .then((res) => {
        var editSmoking = res;
        let editDetailsofSalutation = this.MatDialog.open(addSmokingStatusComponent, {
          data: editSmoking,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofSalutation.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getsmokingstatGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteSmoking"
  deletesmoking(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteSmokingcategory(element.Item.SmokingMasterID).then((res) => {
            this.getsmokingstatGridData();
          });
        }
      });
  }
  //#endregion

}
