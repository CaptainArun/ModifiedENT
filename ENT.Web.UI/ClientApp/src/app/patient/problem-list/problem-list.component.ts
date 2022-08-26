import { Component, OnInit } from "@angular/core";
import { NewPatientService } from "../newPatient.service";
import { MatDialog } from "@angular/material";
import { AddProblemListComponent } from "./add-problem-list/add-problem-list.component";
import { ViewProblemListComponent } from "./view-problem-list/view-problem-list.component";
import { UpdateProblemListComponent } from "./update-problem-list/update-problem-list.component";
import { TableConfig } from "../../ux/columnConfig";
import { CustomHttpService } from "../../core/custom-http.service";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-problem-list",
  templateUrl: "./problem-list.component.html",
  styleUrls: ["./problem-list.component.css"],
})
export class ProblemListComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: any;
  problemList: any;

  constructor(
    public newPatientService: NewPatientService,
    public dialog: MatDialog,
    public custHttp: CustomHttpService,
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
        PropertyName: "ProblemTypeDesc",
        DisplayName: "Problem Type",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "ProblemDescription",
        DisplayName: "Problem Description",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "Status",
        DisplayName: "Problem Status",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "ICD10Code",
        DisplayName: "ICD Code",
        DisplayMode: "Text",
        LinkUrl: "",
      },
      {
        PropertyName: "AlleviatedBy",
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
        PropertyName: "DiagnosedDate",
        DisplayName: "Diagnosed Date",
        DisplayMode: "DateTime",
        FormatString: "dd-MM-yyyy",
        LinkUrl: "",
      },
      {
        PropertyName: "ResolvedDate",
        DisplayName: "Resolved Date",
        DisplayMode: "DateTime",
        FormatString: "dd-MM-yyyy",
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

    this.getProblemList();
  }
  getProblemList() {
    this.newPatientService
      .GetPatientProblemListforPatient(this.patientId)
      .then((res) => {
        this.problemList = res;       
      });
  }
  addProblemList() {
    const addProblemList = this.dialog.open(AddProblemListComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    addProblemList.afterClosed().subscribe((result) => {
      if (result == "Updated") {
        this.getProblemList();
      }
    });
  }
  viewProblemList(data: any) {
    this.newPatientService
      .GetPatientProblemRecordbyID(data.Item.ProblemlistId)
      .then((data) => {
        var patientDetail = data;
        const viewDetails = this.dialog.open(ViewProblemListComponent, {
          data: patientDetail,
          height: "auto",
          width: "auto",
          autoFocus: false,
        });
      });
  }

  updateProblemList(data: any) {
    this.newPatientService
      .GetPatientProblemRecordbyID(data.Item.ProblemlistId)
      .then((res) => {
        var editRecord = res;
        let editDetails = this.dialog.open(UpdateProblemListComponent, {
          data: editRecord,
          height: "auto",
          width: "auto",
          autoFocus: true,
        });
        editDetails.afterClosed().subscribe((result) => {
          if (result == "Updated") {
            this.getProblemList();
          }
        });
      });
  }

  deleteProblemList(data: any) {
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
            .DeletePatientProblemRecord(data.Item.ProblemlistId)
            .then((res) => {
              this.getProblemList();
            });
        }
      });
  }
}
