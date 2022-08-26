import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addReferredLabComponent } from './add-referred-lab/add-referred-lab.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-referredlabComponent",
  styleUrls: ["./referred-lab.component.css"],
  templateUrl: './referred-lab.component.html'
})

export class referredLabComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  referredgrid: any;
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
      { PropertyName: 'ReferredLabCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'ReferredLabDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getreferredlabGridData();
  }
  getreferredlabGridData() {
    this.configurationservice.Referredcategorygrid().then((res) => {
      this.referredgrid = res;
    }
    );
  }
  //#region "Addillness"

  addreferredlab() {
    const newreferred = this.MatDialog.open(addReferredLabComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newreferred.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getreferredlabGridData();
      }
    });
  }
  //#endregion

  //#region "Editillness"

  editreferred(element: any) {
    this.configurationservice.Referrededitgridcategory(element.Item.ReferredLabID)
      .then((res) => {
        var editreferred = res;
        let editDetailsofIllness = this.MatDialog.open(addReferredLabComponent, {
          data: editreferred,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofIllness.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getreferredlabGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteillness"
  deleterefeered(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeletedReferred(element.Item.ReferredLabID).then((res) => {
            this.getreferredlabGridData();
          });
        }
      });
  }
  //#endregion

}
