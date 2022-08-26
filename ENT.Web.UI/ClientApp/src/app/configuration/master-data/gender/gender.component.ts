import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addGenderComponent } from './add-gender/add-gender.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "genderComponent",
    styleUrls: ["./gender.component.css"],
  templateUrl: './gender.component.html'
  })

export class GenderComponent implements OnInit{
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  gendergrid: any;
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
      { PropertyName: 'GenderCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'GenderDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getGenderGridData();
  }
  getGenderGridData() {
    this.configurationservice.Gendergrid().then((res) => {
      this.gendergrid = res;
    }
    );
  }
  //#region "AddGender"

  addNewGender() {
    const newGender = this.MatDialog.open(addGenderComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newGender.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getGenderGridData();
      }
    });
  }
  //#endregion

  //#region "EditGender"

  editGender(element: any) {
    this.configurationservice.Gendereditgrid(element.Item.GenderID)
      .then((res) => {
        var editGender = res;
        let editDetailsofGender = this.MatDialog.open(addGenderComponent, {
          data: editGender,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofGender.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getGenderGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteGender"
  deleteGender(element: any) {
    this.config
      .showMessage("Delete","Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteGender(element.Item.GenderID).then((res) => {
            this.getGenderGridData();
          });
        }
      });
  }
  //#endregion

}
