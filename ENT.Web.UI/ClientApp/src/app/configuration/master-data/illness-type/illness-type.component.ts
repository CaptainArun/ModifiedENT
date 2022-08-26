import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addIllnessTypeComponent } from './add-illness-type/add-illness-type.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-illnesstypeComponent",
  styleUrls: ["./illness-type.component.css"],
  templateUrl: './illness-type.component.html'
})

export class IllnessTypeComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  ilnessgrid: any;
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
      { PropertyName: 'IllnessTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'IllnessTypeDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getIllnessTypeGridData();
  }
  getIllnessTypeGridData() {
    this.configurationservice.illnesscategorygrid().then((res) => {
      this.ilnessgrid = res;
    }
    );
  }
  //#region "Addillness"

  addillnesstype() {
    const newIllness = this.MatDialog.open(addIllnessTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newIllness.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getIllnessTypeGridData();
      }
    });
  }
  //#endregion

  //#region "Editillness"

  editillness(element: any) {
    this.configurationservice.illnesseditgridcategory(element.Item.IllnessTypeID)
      .then((res) => {
        var editIllness = res;
        let editDetailsofIllness = this.MatDialog.open(addIllnessTypeComponent, {
          data: editIllness,
          height: "auto",
          width: "auto",
          autoFocus: true,
        });
        editDetailsofIllness.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getIllnessTypeGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteillness"
  deleteillness(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletedillness(element.Item.IllnessTypeID).then((res) => {
            this.getIllnessTypeGridData();
          });
        }
      });
  }
  //#endregion

}
