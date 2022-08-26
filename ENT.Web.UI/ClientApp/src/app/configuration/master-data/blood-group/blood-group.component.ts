import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addBloodGroupComponent } from './add-blood-group/add-blood-group.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-bloodgroupComponent",
  styleUrls: ["./blood-group.component.css"],
  templateUrl: './blood-group.component.html'
})

export class BloodGroupComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  bloodgrid: any;
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
      { PropertyName: 'BloodGroupCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'BloodGroupDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getbloodgroupGridData();
  }
  getbloodgroupGridData() {
    this.configurationservice.getbloodgroup().then((res) => {
      this.bloodgrid = res;
    }
    );
  }
  //#region "Addblood"

  addNewblood() {
    const newblood = this.MatDialog.open(addBloodGroupComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newblood.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getbloodgroupGridData();
      }
    });
  }
  //#endregion

  //#region "Editblood"

  editblood(element: any) {
    this.configurationservice.getbloodgroupid(element.Item.BloodGroupID)
      .then((res) => {
        var editblood = res;
        let editDetailsofblood = this.MatDialog.open(addBloodGroupComponent, {
          data: editblood,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofblood.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getbloodgroupGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteblood"
  deleteblood(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deletebloodgroup(element.Item.BloodGroupID).then((res) => {
            this.getbloodgroupGridData();
          });
        }
      });
  }
  //#endregion

}
