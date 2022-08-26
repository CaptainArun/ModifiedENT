import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { MobilityAddComponent } from "./add-mobility/add-mobility.component";


@Component({
    selector: "app-mobility",
      styleUrls: ["./mobility.component.css"],
    templateUrl: './mobility.component.html'
    })
    export class MobilityComponent implements OnInit{
   //#region "Property Declaration"

   tableConfig: TableConfig = new TableConfig;
   mobilitygrid: any;
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
      { PropertyName: 'FCMobilityCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'FCMobilityDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getMobilityGridData();
  }


  getMobilityGridData() {
    this.configurationservice.Mobilitygrid().then((res) => {
      this.mobilitygrid = res;
      
    }
    );
  }
//#region "AddMobility"

addNewMobility() {
    const newMobiltiy = this.MatDialog.open(MobilityAddComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newMobiltiy.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getMobilityGridData();
      }
    });
  }
  //#endregion


  //#region "Editmobility"

  editmobility(element: any) {
    this.configurationservice.Mobilityeditgrid(element.Item.FCMobilityID )
      .then((res) => {
        var editMobility = res;
        let editDetailsofMobility= this.MatDialog.open(MobilityAddComponent, {
          data: editMobility,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofMobility.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getMobilityGridData();
          }
        });
      });
  }



 //#region "deleteMobility"
 Deletemobility(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.Deletemobility(element.Item.FCMobilityID ).then((res) => {
            this.getMobilityGridData();
          });
        }
      });
  }
  //#endregion



    }
