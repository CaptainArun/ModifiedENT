import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addCountryComponent } from "./add-country/add-country.component";

@Component({
    selector: "app-countryComponent",
    styleUrls: ["./country.component.css"],
    templateUrl: './country.component.html'
    })
export class countryComponent implements OnInit{
      
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
      { PropertyName: 'CountryCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'CountryDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  //#region ngOnInit
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGridDataForCountry();
  }
  //#endregion ngOnInit

  //#region Grid Data
  getGridDataForCountry() {
    this.configurationservice.getGridDataForCountry().then((res) => {
      this.gridData = res;
    });
  }
    //#endregion Grid Data
    
  //#region "AddGait"

  AddNew() {
    const newGait = this.MatDialog.open(addCountryComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGridDataForCountry();
      }
    });
  }
  //#endregion

  //#region "EditGait"

  Edit(element: any) {
    this.configurationservice.editRecordOfCountry(element.Item.CountryId)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(addCountryComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGridDataForCountry();
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
          this.configurationservice.deleteRecordOfCountry(element.Item.CountryId).then((res) => {
            this.getGridDataForCountry();
          });
        }
      });
  }
  //#endregion
 }

