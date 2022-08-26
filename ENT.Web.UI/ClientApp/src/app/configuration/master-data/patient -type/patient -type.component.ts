import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addPatientTypeComponent } from './add-patient -type/add-patient-type.component'
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "patienttypecomponent",
  styleUrls: ["./patient -type.component.css"],
  templateUrl: './patient -type.component.html'
})

export class PatientTypeComponent implements OnInit {
  //#region "Property Declaration"

  tableConfig: TableConfig = new TableConfig;
  patientgrid: any;
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
      { PropertyName: 'PatientTypeCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'PatientTypeDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getpatientgridData();
  }
  getpatientgridData() {
    this.configurationservice.getpatienttypeGridData().then((res) => {
      this.patientgrid = res;
    }
    );
  }
  //#region "Addpatient"

  addNewpatient() {
    const newpatient = this.MatDialog.open(addPatientTypeComponent, {
      height: "auto",
      width: "25%",
      autoFocus: false,
    });
    newpatient.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getpatientgridData();
      }
    });
  }
  //#endregion

  //#region "editpatient"

  editpatient(element: any) {
    this.configurationservice.getpatienttypeId(element.Item.PatientTypeID)
      .then((res) => {
        var editpatient = res;
        let editDetailsofpatient = this.MatDialog.open(addPatientTypeComponent, {
          data: editpatient,
          height: "auto",
          width: "25%",
          autoFocus: true,
        });
        editDetailsofpatient.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getpatientgridData();
          }
        });
      });
  }
  //#endregion

  //#region "deletepatient"
  deletepatient(element: any) {
    this.config
      .showMessage("Delete", "Are you sure want to delete this item? This action cannot be undone.", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.ConfrimBox)
      .then((res: any) => {
        if (res == true) {
          this.configurationservice.deletepatienttype(element.Item.PatientTypeID).then((res) => {
            this.getpatientgridData();
          });
        }
      });
  }
  //#endregion

}
