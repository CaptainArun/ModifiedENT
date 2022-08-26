import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { CustomHttpService } from "../../core/custom-http.service";
import { UtilService } from "../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../ux/bmsmsgbox/bmsmsgbox.component";
import { TableConfig } from "../../ux/columnConfig";
import { NewPatientService } from "../newPatient.service";
import { PhysicalExamAddComponent } from "./physical-exam-add/physical-exam-add.component";
import { PhysicalExamEditComponent } from "./physical-exam-edit/physical-exam-edit.component";
import { PhysicalExamViewComponent } from "./physical-exam-view/physical-exam-view.component";

@Component({
  selector: "app-physical-exam",
  templateUrl: "./physical-exam.component.html",
  styleUrls: ["./physical-exam.component.css"],
})
export class PhysicalExamComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: number;
  patientexamdata: any;
  constructor(
    public fb: FormBuilder,
    public customHttpSvc: CustomHttpService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    private config: UtilService,
    public serv: NewPatientService
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
        DisplayName: "Visit Date & Time",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "HeadValue",
        DisplayName: "Head",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "NeckValue",
        DisplayName: "Neck",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "ThroatValue",
        DisplayName: "Throat",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "EARValue",
        DisplayName: "EAR",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "SpineValue",
        DisplayName: "Spine",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "FootValue",
        DisplayName: "Foot",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "HandValue",
        DisplayName: "Hand",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "LegValue",
        DisplayName: "Leg",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "AbdomenValue",
        DisplayName: "Abdomen",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "SensationValue",
        DisplayName: "Sensation",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      


  /*    {
        PropertyName: "ChestValue",
        DisplayName: "Chest",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      }, {
        PropertyName: "EyeValue",
        DisplayName: "Eye",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },    {
        PropertyName: "MouthValue",
        DisplayName: "Mouth",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      }, {
        PropertyName: "NailsValue",
        DisplayName: "Nails",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      }, */
    ];
  }
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.serv.patientId = this.patientId;
    });

    this.getPhysicalexamforPatient();
  }
  openAddUpdateform() {
    const dialogRef = this.dialog.open(PhysicalExamAddComponent, {
      height: "auto",
      width: "2000px",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "update") { 
        this.getPhysicalexamforPatient();
      }
    });
  }
  getPhysicalexamforPatient() {
    this.serv.getPhysicalExamforPatient(this.patientId).then((res) => {
   
      this.patientexamdata = res;
    });
  }
  openPatientPhysicalexamView(element: any) {
    this.serv.getPhysicalexamdetailsbyId(element.Item.PhysicalExamID).then((data) => {
      var patientDetail = data;
      const dialogRef = this.dialog.open(PhysicalExamViewComponent, {
        data: patientDetail,
        height: 'auto',
        width: "2000px",
        autoFocus: false,
      });
    });
  }
  openPatientPhysicalexamEdit(element: any) {
    this.serv.getPhysicalexamdetailsbyId(element.Item.PhysicalExamID).then((data) => {
      
      var patientDetail = data;
      const dialogRef = this.dialog.open(PhysicalExamEditComponent, {
        data: patientDetail,
        height: "auto",
        width: "2000px",
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "update") {
          this.getPhysicalexamforPatient();
        }
      });
    });
  }
  deletePhycialexamRecord(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",
        BMSMessageBoxColorMode.Information,
        BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.serv.DeletePhysicalExamDetails(element.Item.PhysicalExamID).then((data) => {
            this.getPhysicalexamforPatient();
          });
        }
      });
  }
}
