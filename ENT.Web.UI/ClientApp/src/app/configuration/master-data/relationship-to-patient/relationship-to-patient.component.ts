import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addRealtionshipToPatientComponent } from './add-relationship-to-patient/add-relationship-to-patient.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "src/app/ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-relationshipComponent",
  styleUrls: ["./relationship-to-patient.component.css"],
  templateUrl: './relationship-to-patient.component.html'
})

export class relationshipToPatientComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  relationshipgrid: any;
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
      { PropertyName: 'RSPCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'RSPDescription', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getrelationshipstatusGridData();
  }
  getrelationshipstatusGridData() {
    this.configurationservice.Relationshipcategorygrid().then((res) => {
      this.relationshipgrid = res;
    }
    );
  }
  //#region "AddFamilyhistory"

  addNewrelationship() {
    const newrealtionship = this.MatDialog.open(addRealtionshipToPatientComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newrealtionship.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getrelationshipstatusGridData();
      }
    });
  }
  //#endregion

  //#region "Editfamily"

  editrelationship(element: any) {
    this.configurationservice.Relationshipeditgridcategory(element.Item.RSPId)
      .then((res) => {
        var editrelaionship = res;
        let editDetailsofFamily = this.MatDialog.open(addRealtionshipToPatientComponent, {
          data: editrelaionship,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofFamily.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getrelationshipstatusGridData();
          }
        });
      });
  }
  //#endregion

  //#region "deleteFamily"
  deleterelationship(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.DeletedRelationship(element.Item.RSPId).then((res) => {
            this.getrelationshipstatusGridData();
          });
        }
      });
  }
  //#endregion

}
