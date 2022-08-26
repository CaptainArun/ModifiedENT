import { Component, OnInit } from "@angular/core";
import { TableConfig } from "../../ux/columnConfig";
import { NewPatientService } from "../newPatient.service";
import { MatDialog } from "@angular/material";
import { CustomHttpService } from "../../core/custom-http.service";
import { AddAllergiesComponent } from "./add-allergies/add-allergies.component";
import { DatePipe } from "@angular/common";
import { ViewAllergiesComponent } from "./view-allergies/view-allergies.component";
import { UpdateAllergiesComponent } from "./update-allergies/update-allergies.component";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-allergies",
  templateUrl: "./allergies.component.html",
  styleUrls: ["./allergies.component.css"],
})
export class AllergiesComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: any;
  allergiesRecord: any;
  constructor(
    public newPatientService: NewPatientService,
    public dialog: MatDialog,
    public custHttp: CustomHttpService,
    public datePipe: DatePipe,
    public activateRoute: ActivatedRoute,
    private config: UtilService
  ) {
    this.tableConfig.showPagination = true;
    this.tableConfig.showView = true;
    this.tableConfig.showIcon = false;
    this.tableConfig.showEdit = true;
    this.tableConfig.showAdd = false;
    this.tableConfig.showDelete = true;
    this.tableConfig.columnConfig = [
      {
        PropertyName: "visitDateandTime",
        DisplayName: "visit Date and Time",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "AllergyTypeDesc",
        DisplayName: "Allergy Type",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Name",
        DisplayName: "Allergy Name",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "AllergySeverityDesc",
        DisplayName: "Severity",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Status",
        DisplayName: "Status",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Alleviatedby",
        DisplayName: "Alleviated By",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Aggravatedby",
        DisplayName: "Aggravated By",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Reaction",
        DisplayName: "Reaction",
        DisplayMode: "Text",
        LinkUrl: "",
      },
    ];
  }
  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.newPatientService.patientId = this.patientId;
    });
    this.getAllergiesRecord();
  }
  //Allergy Record
  getAllergiesRecord() {
    this.newPatientService
      .GetAllergiesforPatient(this.patientId)
      .then((res) => {
        this.allergiesRecord = res;     
      });
  }
  //Add Alergy
  addAllergies() {
    var data = this.patientId;
    const addAllergie = this.dialog.open(AddAllergiesComponent, {
      data: data,
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    addAllergie.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getAllergiesRecord();
      }
    });
  }
  //View allergy
  viewAllergies(element: any) {
    this.newPatientService
      .GetAllergyRecordbyID(element.Item.AllergyId)
      .then((data) => {
        var patientDetail = data;
        const viewDetails = this.dialog.open(ViewAllergiesComponent, {
          data: patientDetail,
          height: "auto",
          width: "auto",
          autoFocus: false,
        });
      });
  }
  //Update Allergy
  updateAllergies(element: any) {
    this.newPatientService
      .GetAllergyRecordbyID(element.Item.AllergyId)
      .then((res) => {
        var editRecord = res;
        let editDetails = this.dialog.open(UpdateAllergiesComponent, {
          data: editRecord,
          height: "auto",
          width: "auto",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getAllergiesRecord();
          }
        });
      });
  }
  //delete Allergy
  deleteAllergies(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",
        BMSMessageBoxColorMode.Information,
        BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.newPatientService
            .DeleteAllergyRecord(element.Item.AllergyId)
            .then((res) => {
              this.getAllergiesRecord();
            });
        }
      });
  }
}
