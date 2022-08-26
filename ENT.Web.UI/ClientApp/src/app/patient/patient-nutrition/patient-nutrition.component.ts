import { Component, OnInit } from "@angular/core";
import { TableConfig } from "../../ux/columnConfig";
import { CustomHttpService } from "../../core/custom-http.service";
import { NewPatientService } from "../newPatient.service";
import { MatDialog } from "@angular/material";
import { PatientNutritionAddComponent } from "./patient-nutrition-add/patient-nutrition-add.component";
import { PatientNutritionViewComponent } from "./patient-nutrition-view/patient-nutrition-view.component";
import { PatientNutritionEditComponent } from "./patient-nutrition-edit/patient-nutrition-edit.component";
import { ActivatedRoute } from "@angular/router";
import { UtilService } from "../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../ux/bmsmsgbox/bmsmsgbox.component";

@Component({
  selector: "app-patient-nutrition",
  templateUrl: "./patient-nutrition.component.html",
  styleUrls: ["./patient-nutrition.component.css"],
})
export class PatientNutritionComponent implements OnInit {
  tableConfig: TableConfig = new TableConfig();
  patientId: number = 1;
  nutriData: any;

  constructor(
    public customhttp: CustomHttpService,
    public newPatsvc: NewPatientService,
    public dialogue: MatDialog,
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
        isVisible: true,
      },
      {
        PropertyName: "IntakeCategory",
        DisplayName: "Category",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "EatRegularly",
        DisplayName: "Eating Regularly",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "Carvings",
        DisplayName: "Carvings",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "DislikedIntake",
        DisplayName: "Dislikes",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
      {
        PropertyName: "FoodAllergies",
        DisplayName: "Food Allergies",
        DisplayMode: "Text",
        LinkUrl: "",
        isVisible: true,
      },
    ];
  }
  ngOnInit() {
    this.customhttp.getDbName(localStorage.getItem("DatabaseName"));
    this.activateRoute.params.subscribe((params) => {
      this.patientId = params["PatientId"];
      this.newPatsvc.patientId = this.patientId;
    });
    this.getNutritionRecord();
  }
  openAddUpdateForm() {
    const dialogRef = this.dialogue.open(PatientNutritionAddComponent, {
      //data: patientForm,
      height: "auto",
      width: "auto",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "update") {
        this.getNutritionRecord();
      }
    });
  }
  openNutritionViewRec(element: any) {
    this.newPatsvc
      .getNutritionRecordbyId(element.Item.NutritionAssessmentID)
      .then((data) => {
        var patientDetail = data;
        const dialogRef = this.dialogue.open(PatientNutritionViewComponent, {
          data: patientDetail,
          height: "auto",
          width: "auto",
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result == "update") {
            this.getNutritionRecord();
          }
        });
      });
  }

  openNutritionEditRecord(element: any) {
    this.newPatsvc
      .getNutritionRecordbyId(element.Item.NutritionAssessmentID)
      .then((data) => {
        var patientDetail = data;
        const dialogRef = this.dialogue.open(PatientNutritionEditComponent, {
          data: patientDetail,
          height: "auto",
          width: "auto",
          autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result == "update") {
            this.getNutritionRecord();
          }
        });
      });   
  }
  getNutritionRecord() {
    this.newPatsvc.getNutritionRecord(this.patientId).then((res) => {
      this.nutriData = res;      
    });
  }
  deleteNutriRecord(element: any) {
    this.config
      .showMessage(
        "Delete",
        "Are you sure want to delete this item? This action cannot be undone.",
        BMSMessageBoxColorMode.Information,
        BMSMessageBoxMode.ConfrimBox
      )
      .then((res: any) => {
        if (res == true) {
          this.newPatsvc
            .deleteNutritionRec(element.Item.NutritionAssessmentID)
            .then((res) => {});
          this.getNutritionRecord();
          this.getNutritionRecord();
          this.customhttp.getDbName(localStorage.getItem("DatabaseName"));
        }
      });
  }
}
