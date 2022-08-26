import { Component, OnInit } from "@angular/core";
import { NewPatientService } from "../newPatient.service";
import { FormBuilder } from "@angular/forms";
import { CustomHttpService } from "../../core/custom-http.service";
import { MatDialog } from "@angular/material";
import { PatientROSAddComponent } from "./patient-ros-add/patient-ros-add.component";
import { PatientROSViewComponent } from "./patient-ros-view/patient-ros-view.component";
import { PatientROSEditComponent } from "./patient-ros-edit/patient-ros-edit.component";
import { TableConfig } from "../../ux/columnConfig";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-patient-ros",
  templateUrl: "./patient-ros.component.html",
  styleUrls: ["./patient-ros.component.css"],
})
export class PatientROSComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: number = 1;
  ROSdata: any;
  constructor(
    public serv: NewPatientService,
    public fb: FormBuilder,
    public customHttpSvc: CustomHttpService,
    public dialog: MatDialog,
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
       //general
      {
        PropertyName: "Weightlossorgain",
        DisplayName: "Weight loss(or)gain",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "Feverorchills",
        DisplayName: "Fever",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "Fatigue",
        DisplayName: "Fatigue",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

     //skin
      {
        PropertyName: "Rashes",
        DisplayName: "Rashes",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "SkinLumps",
        DisplayName: "Skin Lumps",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

      //Head
      {
        PropertyName: "Headache",
        DisplayName: "Headache",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
     
    
      //Eyes
      {
        PropertyName: "Blurryordoublevision",
        DisplayName: "Blurry(or)double vision",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

     //Nose
      {
        PropertyName: "Sinuspain",
        DisplayName: "Sinuspain",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

      
      //Neck
      {
        PropertyName: "NeckPain",
        DisplayName: "Neck Pain",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "Stiffness",
        DisplayName: "Stiffness",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

      //Respiratory
      {
        PropertyName: "Shortnessofbreath",
        DisplayName: "Shortness of breath",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

      //Psychiatric
      {
        PropertyName: "Depression",
        DisplayName: "Depression",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },

      ];
  }

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.serv.patientId = this.patientId;
    });
    this.getROSforPatient();
  }

  getROSforPatient() {
    this.serv.getROSdetailsforPatient(this.patientId).then((res) => {
      this.ROSdata = res;      
    });
  }

  openAddUpdateform() {
    const dialogRef = this.dialog.open(PatientROSAddComponent, {
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "update") {
        this.getROSforPatient();
      }
    });
  }

  openPatientROSView(element: any) {
    this.serv.getROSdetailsbyId(element.Item.ROSID).then((data) => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(PatientROSViewComponent, {
        data: patientDetail,
        height: "auto",
        width: "auto",
        autoFocus: false,
      });
    });
  }

  openPatientROSEdit(element: any) {
    this.serv.getROSdetailsbyId(element.Item.ROSID).then((data) => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(PatientROSEditComponent, {
        data: patientDetail,
        height: "auto",
        width: "auto",
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "update") {
          this.getROSforPatient();
        }
      });
    });
  }
  deleteROSRecord(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",
        BMSMessageBoxColorMode.Information,
        BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.serv.DeleteROSDetails(element.Item.ROSID).then((data) => {
            this.getROSforPatient();
          });
        }
      });
  }
}
