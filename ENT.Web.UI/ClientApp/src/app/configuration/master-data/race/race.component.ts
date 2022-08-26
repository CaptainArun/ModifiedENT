import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addRaceComponent } from './add-race/add-race.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "racecomponent",
    styleUrls: ["./race.component.css"],
  templateUrl: './race.component.html'
  })

export class RaceComponent implements OnInit{
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  racegrid: any;
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
      { PropertyName: 'RaceCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'RaceDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getracegridData();
  }
  getracegridData() {
    this.configurationservice.getrace().then((res) => {
      this.racegrid = res;
    }
    );
  }
  //#region "Addrace"

  addNewRace() {
    const newrace = this.MatDialog.open(addRaceComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newrace.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getracegridData();
      }
    });
  }
  //#endregion

  //#region "editRace"

  editRace(element: any) {
    this.configurationservice.getraceid(element.Item.RaceID)
      .then((res) => {
        var editRace = res;
        let editDetailsofRace = this.MatDialog.open(addRaceComponent, {
          data: editRace,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofRace.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getracegridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleterace"
  deleteRace(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleterace(element.Item.RaceID).then((res) => {
            this.getracegridData();
          });
        }
      });
  }
  //#endregion

}
