import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addSalutationComponent } from './add-salutation/add-salutation.component'
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-salutation",
  styleUrls: ["./salutation.component.css"],
  templateUrl: './salutation.component.html'
})

export class SalutationComponent implements OnInit {
    //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  salutationgrid: any;
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
      { PropertyName: 'SalutationCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%",},
      { PropertyName: 'SalutationDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
    //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getsalutattionGridData();
  }
  getsalutattionGridData() {
    this.configurationservice.salutationgrid().then((res) => {
      this.salutationgrid = res;
    }
    );
  }
      //#region "AddSalutation"

  addNewSalutation() {
    const newSalutation= this.MatDialog.open(addSalutationComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newSalutation.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getsalutattionGridData();
      }
    });
  }
      //#endregion

    //#region "EditSalutation"

  editsalutation(element: any) {
    this.configurationservice.salutationeditgrid(element.Item.SalutationID)
      .then((res) => {
        var editSalutation = res;
        let editDetailsofSalutation= this.MatDialog.open(addSalutationComponent, {
          data: editSalutation,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofSalutation.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getsalutattionGridData();
          }
        });
      });
  }
      //#endregion

  //#region "deleteSalutation"
  deleteSalutation(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",BMSMessageBoxColorMode.Information,BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeleteSalutation(element.Item.SalutationID).then((res) => {            
              this.getsalutattionGridData();
            });
        }
      });
  }
      //#endregion

}
