import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addReligionComponent } from './add-religion/add-religion.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "religioncomponent",
    styleUrls: ["./religion.component.css"],
  templateUrl: './religion.component.html'
  })

export class ReligionComponent implements OnInit{
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  religiongrid: any;
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
      { PropertyName: 'ReligionCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'ReligionDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getreligiongridData();
  }
  getreligiongridData() {
    this.configurationservice.getreligion().then((res) => {
      this.religiongrid = res;
    }
    );
  }
  //#region "Addreligion"

  addNewReligion() {
    const newreligion = this.MatDialog.open(addReligionComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newreligion.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getreligiongridData();
      }
    });
  }
  //#endregion

  //#region "editReligion"

  editReligion(element: any) {
    this.configurationservice.getreligionid(element.Item.ReligionID)
      .then((res) => {
        var editReligion = res;
        let editDetailsofReligion = this.MatDialog.open(addReligionComponent, {
          data: editReligion,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofReligion.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getreligiongridData();
          }
        });
      });
  }
  //#endregion

  //#region "deletereligion"
  deleteReligion(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deletereligion(element.Item.ReligionID).then((res) => {
            this.getreligiongridData();
          });
        }
      });
  }
  //#endregion

}
