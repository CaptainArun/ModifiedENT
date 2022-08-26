import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../../core/custom-http.service";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../../ux/columnConfig";
import { ConfigurationService } from "../../configuration.service";
import { addLanguageComponent } from "./add-language/add-language.component";

@Component({
  selector: "app-languageComponent",
  styleUrls: ["./language.component.css"],
  templateUrl: './language.component.html'
})

export class languageComponent implements OnInit{
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

      { PropertyName: 'LanguageCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'LanguageDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGridDataForLanguage();
  }
  //#endregion "ngOnInit"

  //#region "Table Record"
  getGridDataForLanguage() {
    this.configurationservice.getGridDataForLanguage().then((res) => {
      this.gridData = res;    
    });
  }
   //#endregion "Table Record"

  //#region Add new Pop up
  AddNew() {
    const newGait = this.MatDialog.open(addLanguageComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGait.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGridDataForLanguage();
      }
    });
  }
  //#endregion

  //#region Edit Pop up 
  edit(element: any) {
    this.configurationservice.editRecordOfLanguage(element.Item.LanguageId)
      .then((res) => {
        var editGait = res;
        let editDetailsofGait = this.MatDialog.open(addLanguageComponent, {
          data: editGait,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGait.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGridDataForLanguage();
          }
        });
      });
  }
  //#endregion

  //#region delete record
  delete(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deleteRecordOfLanguage(element.Item.LanguageId).then((res) => {
            this.getGridDataForLanguage();
          });
        }
      });
  }
  //#endregion
}

