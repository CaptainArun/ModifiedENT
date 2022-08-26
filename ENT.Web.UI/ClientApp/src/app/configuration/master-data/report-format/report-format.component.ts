import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addReportFormatComponent } from './add-report-format/add-report-format.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-reportformatComponent",
  styleUrls: ["./report-format.component.css"],
  templateUrl: './report-format.component.html'
})

export class reportFormatComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  reportgrid: any;
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
      { PropertyName: 'ReportFormatCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'ReportFormatDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getreportTypeGridData();
  }
  getreportTypeGridData() {
    this.configurationservice.Reportcategorygrid().then((res) => {
      this.reportgrid = res;
    }
    );
  }
  //#region "Addillness"

  addreportType() {
    const newIllness = this.MatDialog.open(addReportFormatComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newIllness.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getreportTypeGridData();
      }
    });
  }
  //#endregion

  //#region "Editillness"

  editreport(element: any) {
    this.configurationservice.reporteditgridcategory(element.Item.ReportFormatID)
      .then((res) => {
        var editreport = res;
        let editDetailsofIllness = this.MatDialog.open(addReportFormatComponent, {
          data: editreport,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofIllness.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getreportTypeGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteillness"
  deletereport(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeletedReport(element.Item.ReportFormatID).then((res) => {
            this.getreportTypeGridData();
          });
        }
      });
  }
  //#endregion

}
