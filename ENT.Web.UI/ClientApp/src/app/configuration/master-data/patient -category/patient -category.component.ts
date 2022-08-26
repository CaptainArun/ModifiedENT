import { Component, OnInit } from "@angular/core";
import { TableConfig } from '../../../ux/columnConfig';
import { UtilService } from '../../../core/util.service';
import { MatDialog } from "@angular/material";
import { addPatientcategoryComponent } from './add-patient -category/add-patient-category.component';
import { CustomHttpService } from '../../../core/custom-http.service';
import { ConfigurationService } from "../../../configuration/configuration.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
@Component({
  selector: "patientcategorycomponent",
  styleUrls: ["./patient -category.component.css"],
  templateUrl: './patient -category.component.html'
})

export class PatientCategoryComponent implements OnInit {
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
      { PropertyName: 'PatientCategoryCode', DisplayName: 'Code', DisplayMode: "Text", LinkUrl: '', width: "15%", },
      { PropertyName: 'PatientCategoryDesc', DisplayName: 'Description', DisplayMode: "Text", LinkUrl: '', width: "60%", },
      { PropertyName: 'OrderNo', DisplayName: 'Order', DisplayMode: "Text", LinkUrl: '', width: "15%" },

    ];
  }
  //#endregion

  ngOnInit() {
    this.CustHttp.getDbName(localStorage.getItem('DatabaseName'));
    this.getpatientgridData();
  }
  getpatientgridData() {
    this.configurationservice.getpatientcategoryGridData().then((res) => {
      this.patientgrid = res;
    }
    );
  }
  //#region "Addpatient"

  addNewpatient() {
    const newpatient = this.MatDialog.open(addPatientcategoryComponent, {
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
    this.configurationservice.getpatientcategoryId(element.Item.PatientCategoryID)
      .then((res) => {
        var editpatient = res;
        let editDetailsofpatient = this.MatDialog.open(addPatientcategoryComponent, {
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
          this.configurationservice.deletepatientcategory(element.Item.PatientCategoryID).then((res) => {
            this.getpatientgridData();
          });
        }
      });
  }
  //#endregion

}
